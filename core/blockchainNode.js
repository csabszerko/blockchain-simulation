import { getBroadcastChannelInstance } from "../ui/utils/broadcastChannel";
import Blockchain from "./blockchain";
import EventEmitter from "events";

class BlockchainNode extends Blockchain {
  constructor() {
    super();

    this.channel = getBroadcastChannelInstance("gossip");
    this.channel.onmessage = (event) => this.handleMessages(event.data);
    this.nodeId = null;
    this.peers = [];

    console.log("Blockchain node initialized");
  }

  // methods for handling different message types;

  // example message
  // this.channel.postMessage({
  //   from: this.nodeId,
  //   to: null,
  //   type: "NEW_CONNECTION_SYN",
  //   body: null,
  // });

  handleMessages(message) {
    if (message.from === this.nodeId) return;
    switch (message.type) {
      case "NEW_CONNECTION_SYN": // looking to connect
        this.handleNewConnectionSyn(message);
        break;
      case "NEW_CONNECTION_SYNACK": // body: blockchain object
        this.handleNewConnectionSynAck(message);
        break;
      case "NEW_BLOCK":
        this.handleNewBlock(message);
        break;
      case "NEW_TRANSACTION":
        this.handleNewTransaction(message);
        break;
    }
  }

  // responses to message types
  handleNewConnectionSyn(message) {
    this.channel.postMessage({
      from: this.nodeId,
      to: message.from,
      type: "NEW_CONNECTION_SYNACK",
      body: {
        blocks: this._getBlocks(),
        transactionPool: this._getTransactionPool(),
        utxos: this._getUtxos(),
        difficulty: this._getDifficulty(),
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    });
    console.log("Gossip incoming: new connection sync request");
  }

  handleNewConnectionSynAck(message) {
    if (message.to === this.nodeId) {
      const receivedBlockchain = Blockchain.fromObject(message.body);
      if (receivedBlockchain.isBlockchainValid()) {
        // set this classes blockchain data to receivedBlockchain's
        this._setBlocks(message.body.blocks);
        this._setDifficulty(message.body.difficulty);
        this._setUtxos(message.body.utxos);
        this._setTransactionPool(message.body.transactionPool);
      }
      console.log(
        "Gossip incoming:: new connection request acknowledged, blockchain synced"
      );
    }
  }

  handleNewBlock(message) {
    const newBlock = message.body.block;

    const exists = this._getBlocks().some((b) => b.hash === newBlock.hash);
    if (exists) return;

    if (this.isBlockValid(message.body.block, message.body.previousBlock)) {
      // save block to own blockchain;
      this._setBlocks([...this._getBlocks(), message.body.block]);
    }
  }

  handleNewTransaction(message) {
    const tx = message.body.transaction;

    // check if already in pool
    const exists = this._getTransactionPool().some((t) => t.txid === tx.txid);
    if (exists) return;

    if (this.isTransactionValid(tx)) {
      // save transaction to mempool
      this._setTransactionPool([...this._getTransactionPool(), tx]);
    }
  }

  mineAndBroadcastBlock() {
    const newBlock = this.mineBlock();
    this.channel.postMessage({
      from: this.nodeId,
      to: null,
      type: "NEW_BLOCK",
      body: {
        block: newBlock,
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    });
    console.log(
      "Gossip incoming: new block proposal:" + JSON.stringify(newBlock)
    );
  }

  broadcastNewTransaction(transaction) {
    this.addTransaction(transaction);
    this.channel.postMessage({
      from: this.nodeId,
      to: null,
      type: "NEW_TRANSACTION",
      body: {
        transaction: transaction,
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    });
    console.log(
      "Gossip incoming: new transaction proposal:" + JSON.stringify(transaction)
    );
  }
}

export default BlockchainNode;
