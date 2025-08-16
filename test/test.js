import Blockchain from "../src/blockchain.js";
import Block from "../src/block.js";
import Transaction from "../src/transaction.js";
import Wallet from "../src/Wallet.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const bc = new Blockchain();

const user1 = new Wallet();
const user2 = new Wallet();
const user3 = new Wallet();

const t1 = new Transaction({
  from: user1.publicKey,
  to: user2.publicKey,
  amount: 10,
  when: Date.now(),
});

user1.signTransaction(t1);
bc.addTransaction(t1);

const t2 = new Transaction({
  from: user1.publicKey,
  to: user3.publicKey,
  amount: 20,
  when: Date.now(),
});

user1.signTransaction(t2);
bc.addTransaction(t2);
bc.mineBlock();

// this case is to completely remine the last block with my own data -> fixed by the blocks array being private and unreferencable
const t3 = new Transaction({
  from: user3.publicKey,
  to: user1.publicKey,
  amount: 10000,
  when: 1,
});

user3.signTransaction(t3);

const tamperedBlock = bc.blocks[1];

tamperedBlock.transactions = t3;
tamperedBlock.previousHash = bc.blocks[0].hash;

const { hash: tamperedHash, nonce: tamperedNonce } = bc.calculateProofOfWork(
  tamperedBlock.index,
  tamperedBlock.timestamp,
  tamperedBlock.transactions,
  tamperedBlock.previousHash
);
tamperedBlock.hash = tamperedHash;
tamperedBlock.nonce = tamperedNonce;

console.log(
  "Blocks on the blockchain: \n" + JSON.stringify(bc.blocks, null, 5)
);

bc.printBlocks();

console.log(
  `The blockchain is ${bc.isBlockchainValid() ? "valid" : "invalid"}`
);
