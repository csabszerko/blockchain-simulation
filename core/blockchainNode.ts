import { getBroadcastChannelInstance } from "./broadcastChannel.js";
import Blockchain from "./blockchain.js";
import type Transaction from "./transaction.js";
import Wallet from "./wallet.js";
import type { UTXO, UTXOSet } from "./utxo.js";
import type Block from "./block.js";

type MessageType = "SYN" | "SYNACK" | "NEW_BLOCK" | "NEW_TRANSACTION";
type Message = {
  from: string;
  to?: string;
  type: MessageType;
  body: any;
};

type SimplifiedTransaction = {
  from: string | null;
  to: string;
  amount: number;
};

class BlockchainNode extends Blockchain {
  channel: BroadcastChannel;
  nodeId: string | null;
  constructor() {
    super();

    this.channel = getBroadcastChannelInstance("gossip");
    this.channel.onmessage = (event) => this.handleMessages(event.data);
    this.nodeId = null;

    console.log("Blockchain node initialized");
  }

  // UI to access
  get _blocks(): Block[] {
    return JSON.parse(JSON.stringify(this.blocks)); // deep copy
  }

  get _utxos(): UTXOSet {
    return JSON.parse(JSON.stringify(this.utxos)); // deep copy
  }

  get _transactionPool(): Transaction[] {
    return JSON.parse(JSON.stringify(this.transactionPool)); // deep copy
  }

  collectAllUtxosEverOnChain(): UTXOSet {
    const allUtxos: UTXOSet = {};
    for (const block of this.blocks) {
      for (const tx of block.transactions) {
        for (const [index, output] of tx.outputs.entries()) {
          allUtxos[tx.txid + ":" + index] = {
            address: output.address,
            amount: output.amount,
            reserved: false,
          };
        }
      }
    }
    return allUtxos;
  }

  getSimplifiedTransaction(tx: Transaction) {
    const allUtxosEver = this.collectAllUtxosEverOnChain();
    return tx.inputs.length
      ? {
          fromValue: allUtxosEver[tx.inputs[0]!["txid:vout"]]!.address,
          toValue: tx.outputs[0]!.address,
          amountValue: tx.outputs[0]!.amount,
        }
      : {
          fromValue: null,
          toValue: tx.outputs[0]!.address,
          amountValue: tx.outputs[0]!.amount,
        };
  }

  collectAllWalletAddressesOnChain(): string[] {
    const addresses = new Set<string>();

    for (const block of this.blocks) {
      for (const tx of block.transactions) {
        for (const output of tx.outputs) {
          addresses.add(output.address);
        }
      }
    }

    // convert Set to array
    return [...addresses];
  }

  calculateBalanceForWallet(publicKey: string): number {
    const utxos = this.getUtxosForPkey(publicKey, true);
    const balance = Object.values(utxos).reduce(
      (accumulator: number, UTXO: UTXO) => accumulator + UTXO.amount,
      0
    );
    return balance;
  }

  waitForMessages(type: MessageType, durationMs: number): Promise<Message[]> {
    return new Promise((resolve) => {
      const collected: Record<string, Message> = {};

      // keep an eye on this Message type (event.data still correct?)
      const handler = (event: MessageEvent<Message>) => {
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

  handleMessages(message: Message) {
    if (message.from === this.nodeId) return;

    const handlers: Record<MessageType, (msg: Message) => void> = {
      SYN: (msg) => this.handleNewConnectionSyn(msg),
      SYNACK: (msg) => this.handleNewConnectionSynAck(msg),
      NEW_BLOCK: (msg) => this.handleNewBlock(msg),
      NEW_TRANSACTION: (msg) => this.handleNewTransaction(msg),
    };

    const handler = handlers[message.type];
    if (handler) {
      handler(message);
    } else {
      console.warn("Unhandled message type received:", message.type);
    }
  }

  // responses to message types
  handleNewConnectionSyn(message: Message) {
    this.channel.postMessage({
      from: this.nodeId,
      to: message.from,
      type: "SYNACK",
      body: {
        blocks: this.blocks,
        transactionPool: this.transactionPool,
        utxos: this.utxos,
        difficulty: this.difficulty,
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    } as Message);
    console.log("Gossip incoming: new sync request");
  }

  handleNewConnectionSynAck(message: Message) {
    if (message.to === this.nodeId) {
      console.log(
        "Gossip incoming: sync request acknowledged by peer, blockchain synced"
      );
    }
  }

  handleNewBlock(message: Message) {
    const newBlock = message.body.block;
    const previousBlock = message.body.previousBlock;

    const exists = this.blocks.some((b) => b.hash === newBlock.hash);
    if (exists) return;

    // compare block with chain's own set of utxos
    if (this.isBlockValid(newBlock, previousBlock)) {
      // save block to own blockchain
      for (const transaction of newBlock.transactions) {
        this.updateUtxosFromTransaction(transaction);
        this.transactionPool = this.transactionPool.filter(
          // remove block's transactions from node's mempool
          (tx) => tx.txid !== transaction.txid
        );
      }
      // add block to chain
      this.blocks.push(newBlock);
    }
  }

  handleNewTransaction(message: Message) {
    const tx = message.body.transaction;

    // check if already in pool
    const exists = this.transactionPool.some((t) => t.txid === tx.txid);
    if (exists) return;

    if (this.isTransactionValid(tx)) {
      // save transaction to mempool
      this.addTransaction(tx);
    }
  }

  async broadcastSyncRequest(nodeId: string, waitTimeMs: number) {
    this.channel.postMessage({
      from: nodeId,
      type: "SYN",
      body: null,
    } as Message);

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
      (longestNode: Message, currentNode: Message) => {
        return currentNode.body.blocks.length > longestNode.body.blocks.length
          ? currentNode
          : longestNode;
      }
    );

    // set this classes blockchain data to receivedBlockchain's
    this.blocks = nodeWithLongestChain.body.blocks;
    this.difficulty = nodeWithLongestChain.body.difficulty;
    this.utxos = nodeWithLongestChain.body.utxos;
    this.transactionPool = nodeWithLongestChain.body.transactionPool;

    console.log(
      "Collected sync responses:",
      nodes,
      "this response was chosen for sync",
      nodeWithLongestChain
    );
  }

  mineAndBroadcastBlock() {
    const previousBlock = this.blocks.at(-1);
    const newBlock = this.mineBlock();
    this.channel.postMessage({
      from: this.nodeId,
      type: "NEW_BLOCK",
      body: {
        block: newBlock,
        previousBlock: previousBlock,
      }, // needs to send blocks, utxos, pending transactions, difficulty, etc when syncing
    } as Message);
    console.log("Gossip sent: new block proposal:", newBlock);
  }

  addAndBroadcastTransaction(transaction: Transaction) {
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
