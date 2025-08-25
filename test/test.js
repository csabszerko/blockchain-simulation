import Blockchain from "../src/blockchain.js";
import Wallet from "../src/wallet.js";

const bc = new Blockchain();

// start of user creation

const { publicKey: user1Pk, privateKey: user1Sk } = Wallet.initializeKeyPair();
const user1 = new Wallet(user1Pk, user1Sk);
user1.connectToNode(bc);

const { publicKey: user2Pk, privateKey: user2Sk } = Wallet.initializeKeyPair();
const user2 = new Wallet(user2Pk, user2Sk);
user2.connectToNode(bc);

const { publicKey: user3Pk, privateKey: user3Sk } = Wallet.initializeKeyPair();
const user3 = new Wallet(user3Pk, user3Sk);
user3.connectToNode(bc);

// console.log(
//   "Wallets created: \n" +
//     user1.publicKey.substr(100, 30) +
//     "... \n" +
//     user2.publicKey.substr(100, 30) +
//     "... \n" +
//     user3.publicKey.substr(100, 30) +
//     "... \n"
// );

// end of user creation

// start of UTXO initialization

bc.utxos = {
  "tx1:0": { address: user1.publicKey, amount: 5 },
  "tx1:1": { address: user1.publicKey, amount: 8 },
  "tx1:2": { address: user2.publicKey, amount: 4 },
  "tx2:0": { address: user3.publicKey, amount: 4 },
};

// console.log(bc.getUtxosForPkey(user1.publicKey));
// console.log(user1.calculateBalance());

// end of UTXO initialization

// start of transaction initialization

const t1 = user1.createTransaction({ to: user2.publicKey, amount: 10 });
bc.addTransaction(t1);

// const t2 = user2.createTransaction({ to: user3.publicKey, amount: 12 });
// bc.addTransaction(t2);

bc.mineBlock();

// end of transaction initialization

// this case is to completely remine the last block with my own data -> fixed by the blocks array being private and unreferencable

// const t3 = user3.createTransaction({ to: user1.publicKey, amount: 1000 });

// const tamperedBlocks = bc.blocks;
// const tamperedBlock = tamperedBlocks[1];

// tamperedBlock.transactions = t3;
// tamperedBlock.previousHash = tamperedBlocks[0].hash;

// const { hash: tamperedHash, nonce: tamperedNonce } = bc.calculateProofOfWork(
//   tamperedBlock.index,
//   tamperedBlock.timestamp,
//   tamperedBlock.transactions,
//   tamperedBlock.previousHash
// );
// tamperedBlock.hash = tamperedHash;
// tamperedBlock.nonce = tamperedNonce;

// console.log(
//   "Blocks on the forged blockchain: \n" +
//     JSON.stringify(tamperedBlocks, null, 5)
// );

bc.printBlocks();

console.log(
  `The blockchain is ${bc.isBlockchainValid() ? "valid" : "invalid"}`
);
