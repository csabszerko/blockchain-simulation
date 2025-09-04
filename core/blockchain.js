import {
  DEFAULT_TRANSACTIONS,
  DEFAULT_UTXOS,
} from "../constants/defaultData.js";
import Block from "./block.js";
import forge from "node-forge";
import { Buffer } from "buffer";

class Blockchain {
  #blocks;
  #transactionPool;
  #difficulty;
  #utxos;
  constructor() {
    this.#blocks = [];
    this.#transactionPool = [];
    this.#utxos = {};
    this.#difficulty = 2;
    this.createGenesisBlock();
  }

  // testing purposes only
  set blocks(blocks) {
    this.#blocks = blocks;
  }
  get blocks() {
    return JSON.parse(JSON.stringify(this.#blocks)); // deep copy
  }

  get utxos() {
    return JSON.parse(JSON.stringify(this.#utxos)); // deep copy
  }

  get transactionPool() {
    return JSON.parse(JSON.stringify(this.#transactionPool)); // deep copy
  }

  set utxos(utxos) {
    this.#utxos = utxos;
  }
  // testing purposes only

  createGenesisBlock() {
    const genesisBlock = new Block(
      0,
      Date.now(),
      structuredClone(DEFAULT_TRANSACTIONS),
      "no previous hash",
      "genesis hash",
      "genesis nonce"
    );

    this.#utxos = structuredClone(DEFAULT_UTXOS);
    this.#blocks.push(genesisBlock);
    return genesisBlock;
  }

  mineBlock() {
    const index = this.#blocks.length;
    const timestamp = Date.now();
    const transactions = []; // mined blocks include all valid pending transactions by default (unrealistic)

    for (const transaction of this.#transactionPool) {
      try {
        if (this.isTransactionValid(transaction)) {
          this.updateUtxosFromTransaction(transaction);
          transactions.push(transaction);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const previousHash = index === 0 ? "0" : this.#blocks[index - 1].hash;

    const { hash, nonce } = this.calculateProofOfWork(
      index,
      timestamp,
      transactions,
      previousHash
    );

    const newBlock = new Block(
      index,
      timestamp,
      transactions,
      previousHash,
      hash,
      nonce
    );

    this.#blocks.push(newBlock);
    this.#transactionPool = [];
    return newBlock;
  }

  calculateProofOfWork(index, timestamp, transactions, previousHash) {
    // proof of work
    let hash;
    let nonce = 0;
    while (true) {
      hash = this.calculateHash(
        index,
        timestamp,
        transactions,
        previousHash,
        nonce
      );
      if (hash.startsWith("0".repeat(this.#difficulty))) break;
      nonce++;
    }
    return { hash, nonce };
  }

  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    return forge.md.sha256
      .create()
      .update(
        JSON.stringify({
          index: index,
          timestamp: timestamp,
          transactions: JSON.stringify(transactions),
          previousHash: previousHash,
          nonce: nonce,
        })
      )
      .digest()
      .toHex();
  }

  getUtxosForPkey(publicKey) {
    return Object.fromEntries(
      Object.entries(this.#utxos).filter(
        ([, utxo]) => utxo.address === publicKey && !utxo.reserved
      )
    );
  }

  updateUtxosFromTransaction(transaction, targetUtxos) {
    targetUtxos ??= this.#utxos;
    for (const input of transaction.inputs) {
      delete targetUtxos[input["txid:vout"]]; // delete the spent utxos
    }

    for (const [index, output] of transaction.outputs.entries()) {
      targetUtxos[transaction.txid + ":" + index] = {
        // add the new utxos
        address: output.address,
        amount: output.amount,
        reserved: false,
      };
    }
  }

  addTransaction(transaction) {
    if (this.isTransactionValid(transaction)) {
      if (this.#transactionPool.some((tx) => tx.txid === transaction.txid)) {
        throw new Error("Transaction invalid: already in mempool");
      }
      for (const input of transaction.inputs) {
        this.#utxos[input["txid:vout"]].reserved = true; // delete the spent utxos
      }
      this.#transactionPool.push(transaction);
    }
  }

  isTransactionValid(transaction, validationUtxos) {
    validationUtxos ??= this.#utxos;

    const txidHash = forge.md.sha256
      .create()
      .update(
        JSON.stringify({
          inputs: transaction.inputs,
          outputs: transaction.outputs,
        })
      )
      .digest()
      .toHex();

    if (transaction.txid !== txidHash) {
      console.log(transaction.txid, txidHash);
      throw new Error("Transaction invalid: incorrect transaction id");
    }

    const blankedSignatureInputs = transaction.inputs.map((input) => ({
      ...input,
      signature: null,
    }));

    for (const input of transaction.inputs) {
      const utxoTxidVout = input["txid:vout"];
      const referencedUtxo = validationUtxos[utxoTxidVout];

      if (!referencedUtxo) {
        throw new Error(
          "Transaction invalid: transaction inputs contain utxos that can't be found"
        );
      }

      const transactionHash = forge.md.sha256
        .create()
        .update(
          JSON.stringify({
            inputs: blankedSignatureInputs,
            outputs: transaction.outputs,
            "txid:vout": utxoTxidVout,
            address: referencedUtxo.address,
            amount: referencedUtxo.amount,
          })
        )
        .digest()
        .toHex();

      if (
        !forge.pki.ed25519.verify({
          message: Buffer.from(transactionHash, "hex"),
          signature: Buffer.from(input.signature, "hex"),
          publicKey: Buffer.from(referencedUtxo.address, "hex"),
        })
      ) {
        throw new Error(
          "Transaction invalid: transaction inputs contain incorrect signatures"
        );
      }
    }

    return true;
  }

  isBlockValid(block, previousBlock, targetUtxos) {
    if (block.previousHash != previousBlock.hash)
      throw new Error(
        "Block invalid: block hashes are incorrectly linked on the blockchain"
      );

    if (!block.hash.startsWith("0".repeat(this.#difficulty)))
      throw new Error(
        "Block invalid: proof of work has not been computed correctly"
      );

    if (
      block.hash !=
      this.calculateHash(
        block.index,
        block.timestamp,
        block.transactions,
        block.previousHash,
        block.nonce
      )
    )
      throw new Error("Block invalid: block hashes are incorrect");

    targetUtxos ??= this.#utxos;
    const validationUtxos = structuredClone(targetUtxos); // create a snapshotted version to validate against

    for (const transaction of block.transactions) {
      if (!this.isTransactionValid(transaction, validationUtxos)) {
        throw new Error("Block invalid: invalid transactions");
      }
      this.updateUtxosFromTransaction(transaction, validationUtxos);
    }

    Object.keys(targetUtxos).forEach((key) => delete targetUtxos[key]); // clear out target utxo set while keeping the reference
    Object.assign(targetUtxos, validationUtxos); // populate target utxo set with the new confirmed-valid result utxos of the block
    return true;
  }

  isBlockchainValid() {
    // replay transaction history
    const replayUtxos = structuredClone(DEFAULT_UTXOS);
    for (let i = 1; i < this.#blocks.length; i++) {
      const block = this.#blocks[i];
      if (!this.isBlockValid(block, this.#blocks[i - 1], replayUtxos))
        return false;
    }
    return true;
  }

  printBlocks() {
    console.log(
      "Blocks on the original blockchain: \n" +
        JSON.stringify(this.#blocks, null, 5)
    );
  }
}

export default Blockchain;
