import { createHash } from "crypto";
import Block from "./block.js";

class Blockchain {
  #blocks;
  #transactionPool;
  #difficulty;
  #utxos;
  constructor() {
    this.#blocks = [];
    this.#transactionPool = [];
    this.#utxos = {};
    this.#difficulty = 1;
    this.createGenesisBlock();
  }

  // testing purposes only
  get blocks() {
    return JSON.parse(JSON.stringify(this.#blocks)); // deep copy
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
    return createHash("SHA256")
      .update(
        JSON.stringify({
          index: index,
          timestamp: timestamp,
          transactions: JSON.stringify(transactions),
          previousHash: previousHash,
          nonce: nonce,
        })
      )
      .digest("hex"); // hash contents as strings
  }

  addTransaction(transaction) {
    this.#transactionPool.push(transaction);
    // console.log(
    //   "Transaction was dropped because it is invalid: \n" +
    //     JSON.stringify(transaction, null, 3) +
    //     "\n"
    // );
  }

  validateTransaction(transaction) {
    // inputs reference valid utxos
    // the referenced utxos have the correct amount and address
    // all signatures blank -> check the hashes for the inputs -> verify the sender signed it
  }

  getUtxosForPkey(publicKey) {
    return Object.fromEntries(
      Object.entries(this.#utxos).filter(
        ([, utxo]) => utxo.address === publicKey
      )
    );
  }

  isBlockchainValid() {
    for (let i = 1; i < this.#blocks.length; i++) {
      const block = this.#blocks[i];
      try {
        if (
          block.previousHash != this.#blocks[i - 1].hash ||
          !block.hash.startsWith("0".repeat(this.#difficulty)) ||
          block.hash !=
            this.calculateHash(
              block.index,
              block.timestamp,
              block.transactions,
              block.previousHash,
              block.nonce
            )
        ) {
          return false;
        }
      } catch {
        return false;
      }
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
