import { createHash } from "crypto";

class Blockchain {
  constructor() {
    this.blocks = [];
    this.pendingTransactions = [];
    this.difficulty = 1;
    this.createGenesisBlock();
  }

  addBlock(transactions) {
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
    this.pendingData = [];
    return newBlock;
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
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

class Block {
  constructor(index, timestamp, transactions, previousHash, hash, nonce) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = hash;
    this.nonce = nonce;
  }
}

const bc = new Blockchain();

bc.addBlock([
  {
    from: "d",
    to: "a",
    amount: "20",
  },
  {
    from: "2",
    to: "a",
    amount: "30",
  },
]);
bc.addBlock([
  {
    from: "b",
    to: "a",
    amount: "20",
  },
  {
    from: "c",
    to: "a",
    amount: "30",
  },
]);

// bc.blocks[1].transactions = [
//     {
//         from: 'a',
//         to: 'b',
//         amount: '10000'
//     }
// ];
// bc.blocks[2].previousHash = bc.blocks[1].hash;

console.log(
  "blocks on the blockchain: \n" + JSON.stringify(bc.blocks, null, 3)
);
console.log(bc.validateBlockchain());
