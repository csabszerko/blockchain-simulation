import { createHash } from "crypto";
import Block from "./block.js";

class Blockchain {
  constructor() {
    this.blocks = [];
    this.transactionPool = [];
    this.difficulty = 1;
    this.createGenesisBlock();
  }

  mineBlock() {
    const transactions = [...this.transactionPool]; // mock behavior: mined blocks included all pending transactions (unrealistic)
    const index = this.blocks.length;
    const timestamp = Date.now();
    const previousHash = index === 0 ? "0" : this.blocks[index - 1].hash;
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
      if (hash.startsWith("0".repeat(this.difficulty))) break;
      nonce++;
    }

    const newBlock = new Block(
      index,
      timestamp,
      transactions,
      previousHash,
      hash,
      nonce
    );

    this.blocks.push(newBlock);
    this.transactionPool = [];
    return newBlock;
  }

  addTransaction(transaction) {
    this.transactionPool.push(transaction);
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

    this.blocks.push(genesisBlock);
    return genesisBlock;
  }

  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    return createHash("sha256")
      .update(
        index + timestamp + JSON.stringify(transactions) + previousHash + nonce
      )
      .digest("hex"); // hash contents as strings
  }

  validateBlockchain() {
    for (let i = 1; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      if (block.previousHash != this.blocks[i - 1].hash) {
        return (
          "blockchain is invalid, the block hashes are incorrectly linked starting from block index " +
          block.index
        );
      } else if (
        block.hash !=
        this.calculateHash(
          block.index,
          block.timestamp,
          block.transactions,
          block.previousHash,
          block.nonce
        )
      ) {
        return (
          "blockchain is invalid, block index " +
          block.index +
          " is incorrectly hashed"
        );
      }
    }
    return "blockchain is valid";
  }
}

export default Blockchain;
