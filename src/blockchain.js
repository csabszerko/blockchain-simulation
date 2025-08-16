import { createHash } from "crypto";
import Block from "./block.js";

class Blockchain {
  #blocks;
  #transactionPool;
  #difficulty;
  constructor() {
    this.#blocks = [];
    this.#transactionPool = [];
    this.#difficulty = 1;
    this.createGenesisBlock();
  }

  mineBlock() {
    const index = this.#blocks.length;
    const timestamp = Date.now();
    const transactions = [...this.#transactionPool].filter(
      (transaction) => transaction.timestamp <= timestamp // very basic validation for transactions (they cant be from the future)
    ); // mined blocks include all pending transactions (unrealistic)
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

  addTransaction(transaction) {
    if (transaction.isValid()) {
      this.#transactionPool.push(transaction);
    } else
      console.log(
        "Transaction was dropped because it is invalid: \n" +
          JSON.stringify(transaction, null, 3) +
          "\n"
      );
  }

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

  // this is only to make it easier to tamper with for testing
  get blocks() {
    return JSON.parse(JSON.stringify(this.#blocks)); // deep copy
  }

  printBlocks() {
    console.log(
      "Blocks on the original blockchain: \n" +
        JSON.stringify(this.#blocks, null, 5)
    );
  }
}

export default Blockchain;
