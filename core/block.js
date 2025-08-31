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

export default Block;
