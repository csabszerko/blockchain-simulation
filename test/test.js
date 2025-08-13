import Blockchain from "../src/blockchain.js";
import Block from "../src/block.js";
import Transaction from "../src/transaction.js";

const bc = new Blockchain();

bc.addTransaction(
  new Transaction({
    from: "a",
    to: "b",
    amount: 10,
    when: Date.now(),
  })
);

bc.addTransaction(
  new Transaction({
    from: "a",
    to: "d",
    amount: 101,
    when: Date.now(),
  })
);

bc.mineBlock();

bc.addTransaction(
  new Transaction({
    from: "d",
    to: "b",
    amount: 3,
    when: Date.now(),
  })
);

bc.addTransaction(
  new Transaction({
    from: "b",
    to: "d",
    amount: 130,
    when: Date.now(),
  })
);

bc.addTransaction(
  new Transaction({
    from: "c",
    to: "b",
    amount: 10,
    when: Date.now(),
  })
);

bc.mineBlock();

bc.blocks[1].transactions = [
  {
    from: "a",
    to: "b",
    amount: "10000",
  },
];
bc.blocks[2].previousHash = bc.blocks[1].hash;

console.log(
  "blocks on the blockchain: \n" + JSON.stringify(bc.blocks, null, 3)
);

console.log(bc.validateBlockchain());
