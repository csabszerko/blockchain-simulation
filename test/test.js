import Blockchain from "../core/blockchain.js";
import Transaction from "../core/transaction.js";
import Wallet from "../core/wallet.js";

// error message formatting
process.on("uncaughtException", (err) => {
  console.log("\x1b[1m\x1b[31m" + err.message + "\x1b[0m");
});

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

console.log("user1 balance: " + user1.calculateBalance());
console.log("user2 balance: " + user2.calculateBalance());
console.log("user3 balance: " + user3.calculateBalance());

// end of UTXO initialization

// start of transaction initialization

const t1 = user1.createTransaction({ to: user2.publicKey, amount: 10 });
bc.addTransaction(t1);

// console.log("user1 balance: " + user1.calculateBalance());
// console.log("user2 balance: " + user2.calculateBalance());
// console.log("user3 balance: " + user3.calculateBalance());

const t2 = user2.createTransaction({ to: user3.publicKey, amount: 12 });
bc.addTransaction(t2);

// console.log("user1 balance: " + user1.calculateBalance());
// console.log("user2 balance: " + user2.calculateBalance());
// console.log("user3 balance: " + user3.calculateBalance());

// console.log(bc.utxos);
bc.mineBlock();

// const t3 = user3.createTransaction({ to: user1.publicKey, amount: 14 });
// bc.addTransaction(t3);

// console.log("user1 balance: " + user1.calculateBalance());
// console.log("user2 balance: " + user2.calculateBalance());
// console.log("user3 balance: " + user3.calculateBalance());

const t4 = user1.createTransaction({ to: user2.publicKey, amount: 2 });
bc.addTransaction(t4);

// console.log("user1 balance: " + user1.calculateBalance());
// console.log("user2 balance: " + user2.calculateBalance());
// console.log("user3 balance: " + user3.calculateBalance());

// console.log(bc.utxos);
bc.mineBlock();

// end of transaction initialization

// this case is to completely remine the last block with my own data -> fixed by the blocks array being private and unreferencable

// const t3 = user3.createTransaction({ to: user1.publicKey, amount: 1000 });
// const t5 = new Transaction({
//   inputs: [
//     {
//       "txid:vout": "tx1:0",
//       signature:
//         "BynZ55GiexVev7a11rmXEUVcTYaqgjaE7QyYBPy5tGu9uDAQdzH4+GgAZG9jvi2J207/AkPkkhfkvdQu0Wm0b12oV1yAcMJ8e5HueKxcZw++e6GyJdFa/31eUKQlY16EimwhyLk261xjGqZ+hMQIThDIlfJxXRf1Y3Mp+Ag2Rhjh/l/Ik84dB7YLQ9lsEMkPMW/Q1VcIw2hkYHH3zsxRTGMsC/R2yODn2VGCXvxkeeS2j1FHluPgexx4U9Re9EJ7DOcol6KWsp992/KfeMeDSZPNtibEIdBRLNVAUklI/Y921YAdgXEp7syPg0mU8xo4+zau/uPRtEt+8rgp815joA==",
//     },
//     {
//       "txid:vout": "tx1:1",
//       signature:
//         "vSf4+c/I7+qPIAkVqFbWqq6qphLLTbzKJCCaGS3dEE6uk/v+XHzIRpKwp+D3/dj6dXA7wXlvAUhXkeUq1bPy6rUnud7FALcPvlDIuRcrl11MH4AVMuKmS/PxYI0rFbtgpW0RqWZn7Csashz5EhHiaJrxonj5h5PTuZKxCWFfdYKCOCaH8NUoY49hdxY4NkhEENUl+Uux8mj2zPHNudK/XMArDYjIyRF86fAsTpx57F5Y7ctT9LlTn3mwfVm/y0r5i4Qgj1G+vbHVi97FwDc3ATERFmI7R9s+It8v1msxo2/jlFVYK6fsd2Gk9ivjGPIyYXa0CsFFVugFNi+l/HiOYw==",
//     },
//   ],
//   outputs: [
//     {
//       address:
//         "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA44+bgio/sDSUyF+yx+NK\nmkHoMl9lMXaStyx2GpPlDJ7ygjK/l+UkpZk7IppkWLjfUd/GXVfj4KnRKVE43sYq\n2YOKutCqB6bkHsSVnGmF4MULZrzcgXoBhuKzswYV8aasy8AkKMKYdyncAQdO9NRJ\nZK4bWtk9PYsMXNxhzs17aGPIsm78wAT6xlcZwlwjF0IumJGwjTGZK15vfQbFydqr\nwMkPXn4loxEaMl2rL7PTC5jgvAx4GCQyTUEF4n2OCocm8Cv46lJ4rM7XNqXbVWVW\nkdC/zaPUQSFEEMBO5KBRauiJq+rN4u3eTmzSXqF5x39/Dx73llYwaStU5cd2tAZA\nTwIDAQAB\n-----END PUBLIC KEY-----\n",
//       amount: 10,
//     },
//     {
//       address:
//         "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9ZHE5JwsqasBQfTyAiyu\naQTgFunU08b7ZfJPMSEHZPGmrOlVPDtvOCg1ayEhH5LXikx5QmjaVPPLrlQJHrRO\n8AJ8sZbDz9ORnkhSKVXEf2O19J+J143+Mzbc76Mr9TyYZkyMSDYaVT5wHNJCzVja\nKdyxEN5utRUd8qxLWPK43bQn2S+Nsqkl/dwoauuv/HF6Nv11dTCEyWBOTniUBX18\nAP6HYWsq43UuQIKBvvXPS9A1NkKvbK3re7FfpVRvsq+mPV4JjRBE3ba72tQfkATD\nMT1C3fXqle2IOS6NtO4wRzmtVyJJm70gcsbn2I2fP6Wi/o68/NQU4EEYrV4O9Ase\nJQIDAQAB\n-----END PUBLIC KEY-----\n",
//       amount: 3,
//     },
//   ],
// });

// t3.finalizeTxid();

// const tamperedBlocks = bc.blocks;
// const tamperedBlock = tamperedBlocks[1];

// tamperedBlock.transactions = t5;
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

// bc.blocks = tamperedBlocks;

bc.printBlocks();

console.log(
  bc.validateBlockchain()
    ? "\x1b[1m\x1b[32mBlockchain is valid\x1b[0m"
    : "invalid"
);

console.log("user1 balance: " + user1.calculateBalance());
console.log("user2 balance: " + user2.calculateBalance());
console.log("user3 balance: " + user3.calculateBalance());
