import { getBroadcastChannelInstance } from "../ui/utils/broadcastChannel";
import Blockchain from "./blockchain";

class BlockchainNode extends Blockchain {
  constructor() {
    super();

    this.channel = getBroadcastChannelInstance("gossip");
    this.channel.onmessage = (event) => this.handleMessages(event.data);
    this.nodeId = null;
    this.peers = [];

    console.log("Blockchain node initialized");
  }

  waitForMessages(type, durationMs) {
    return new Promise((resolve) => {
      const collected = {};

      const handler = (event) => {
        const message = event.data;
        if (
          message.type === type &&
          message.from !== this.nodeId &&
          !(message.from in collected)
        ) {
          collected[message.from] = message;
        }
      };

      this.channel.addEventListener("message", handler);

      setTimeout(() => {
        this.channel.removeEventListener("message", handler);
        resolve(Object.values(collected));
      }, durationMs);
    });
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
      case "SYN": // looking to connect
        this.handleNewConnectionSyn(message);
        break;
      case "SYNACK": // body: blockchain object
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
      type: "SYNACK",
      body: {
        blocks: this._getBlocks(),
        transactionPool: this._getTransactionPool(),
        utxos: this._getUtxos(),
        difficulty: this._getDifficulty(),
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    });
    console.log("Gossip incoming: new sync request");
  }

  handleNewConnectionSynAck(message) {
    if (message.to === this.nodeId) {
      console.log(
        "Gossip incoming: sync request acknowledged, blockchain synced"
      );
    }
  }

  handleNewBlock(message) {
    const newBlock = message.body.block;
    const previousBlock = message.body.previousBlock;

    const exists = this._getBlocks().some((b) => b.hash === newBlock.hash);
    if (exists) return;

    // compare block with chain's own set of utxos
    if (this.isBlockValid(newBlock, previousBlock)) {
      // save block to own blockchain
      for (const transaction of newBlock.transactions) {
        this.updateUtxosFromTransaction(transaction);
        this._setTransactionPool(
          this._getTransactionPool().filter(
            // remove block's transactions from node's mempool
            (tx) => tx.txid !== transaction.txid
          )
        );
      }
      // add block to chain
      this._setBlocks([...this._getBlocks(), newBlock]);
    }
  }

  handleNewTransaction(message) {
    const tx = message.body.transaction;

    // check if already in pool
    const exists = this._getTransactionPool().some((t) => t.txid === tx.txid);
    if (exists) return;

    if (this.isTransactionValid(tx)) {
      // save transaction to mempool
      this.addTransaction(tx);
    }
  }

  async broadcastSyncRequest(nodeId, waitTimeMs) {
    this.channel.postMessage({
      from: nodeId,
      to: null,
      type: "SYN",
      body: null,
    });

    console.log(
      `Message broadcasted: new connection sync request. Waiting for ${waitTimeMs}ms to collect responses`
    );
    const nodes = await this.waitForMessages("SYNACK", waitTimeMs);

    // filter out the invalid chains received
    const validNodes = nodes.filter((node) => {
      const reconstructedBlockchan = Blockchain.fromObject(node.body);
      return reconstructedBlockchan.isBlockchainValid();
    });

    if (validNodes.length === 0) {
      console.warn(
        "Sync failed. No valid nodes received, initializing chain to defaults."
      );
      return;
    }
    // find the one with the longest blocks array that is still valid
    const nodeWithLongestChain = validNodes.reduce(
      (longestNode, currentNode) => {
        if (!longestNode) return currentNode; // first element
        return currentNode.body.blocks.length > longestNode.body.blocks.length
          ? currentNode
          : longestNode;
      },
      null
    );

    // set this classes blockchain data to receivedBlockchain's
    this._setBlocks(nodeWithLongestChain.body.blocks);
    this._setDifficulty(nodeWithLongestChain.body.difficulty);
    this._setUtxos(nodeWithLongestChain.body.utxos);
    this._setTransactionPool(nodeWithLongestChain.body.transactionPool);

    console.log(
      "Collected sync responses:",
      nodes,
      "this response was chosen for sync",
      nodeWithLongestChain
    );
  }

  mineAndBroadcastBlock() {
    const previousBlock = this._getBlocks().at(-1);
    const newBlock = this.mineBlock();
    this.channel.postMessage({
      from: this.nodeId,
      to: null,
      type: "NEW_BLOCK",
      body: {
        block: newBlock,
        previousBlock: previousBlock,
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    });
    console.log("Gossip sent: new block proposal:", newBlock);
  }

  addAndBroadcastTransaction(transaction) {
    this.addTransaction(transaction);
    this.channel.postMessage({
      from: this.nodeId,
      to: null,
      type: "NEW_TRANSACTION",
      body: {
        transaction: transaction,
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    });
    console.log("Gossip sent: new transaction proposal:", transaction);
  }
}

export default BlockchainNode;
