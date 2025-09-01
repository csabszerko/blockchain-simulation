import { DEFAULT_UTXOS } from "../constants/defaultData.js";
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
    //default utxos
    this.#utxos = DEFAULT_UTXOS;
    this.#difficulty = 1;
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

  get utxos() {
    return this.#utxos;
  }

  set utxos(utxos) {
    this.#utxos = utxos;
  }
  // testing purposes only

  createGenesisBlock() {
    const genesisBlock = new Block(
      0,
      Date.now(),
      "this is the genesis block",
      "no previous hash",
      "genesis hash",
      "genesis nonce"
    );

    this.#blocks.push(genesisBlock);
    return genesisBlock;
  }

  mineBlock(transactions = null) {
    const index = this.#blocks.length;
    const timestamp = Date.now();
    transactions ??= this.#transactionPool; // mined blocks include all pending transactions by default (unrealistic)
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

  addTransaction(transaction) {
    if (this.validateTransaction(transaction)) {
      for (const input of transaction.inputs) {
        delete this.#utxos[input["txid:vout"]]; // delete the spent utxos
      }

      for (const [index, output] of transaction.outputs.entries()) {
        this.#utxos[transaction.txid + ":" + index] = {
          // add the new utxos
          address: output.address,
          amount: output.amount,
        };
      }
      this.#transactionPool.push(transaction);
    }
  }

  validateTransaction(transaction) {
    // inputs reference valid utxos
    // all signatures blank -> check the hashes for the inputs -> verify the sender signed it

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
      const referencedUtxo = this.#utxos[utxoTxidVout];

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
      )
        throw new Error(
          "Transaction invalid: transaction inputs contain incorrect signatures"
        );
    }

    return true;
  }

  getUtxosForPkey(publicKey) {
    return Object.fromEntries(
      Object.entries(this.#utxos).filter(
        ([, utxo]) => utxo.address === publicKey
      )
    );
  }

  validateBlockchain() {
    for (let i = 1; i < this.#blocks.length; i++) {
      const block = this.#blocks[i];
      if (block.previousHash != this.#blocks[i - 1].hash)
        throw new Error(
          "Blockchain invalid: block hashes are incorrectly linked on the blockchain"
        );

      if (!block.hash.startsWith("0".repeat(this.#difficulty)))
        throw new Error(
          "Blockchain invalid: proof of work has not been computed correctly"
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
        throw new Error("Blockchain invalid: block hashes are incorrect");
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
