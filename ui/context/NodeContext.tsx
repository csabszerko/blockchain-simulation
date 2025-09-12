import { createContext, useContext, useState } from "react";
import BlockchainNode from "../../core/blockchainNode.js";
import { DEFAULT_WALLETS } from "../../constants/defaultData.js";
import Wallet from "../../core/wallet.js";
import type Block from "../../core/block.js";
import type Transaction from "../../core/transaction.js";
import type { UTXO, UTXOSet } from "../../core/utxo.js";

interface NodeContextType {
  node: BlockchainNode;
  syncNodeUIStates: () => void;
  wallets: Wallet[];
  addWallet: (publicKey: string, privateKey: string) => void;
  blocks: Block[];
  addBlock: () => void;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  utxos: UTXOSet;
  setUtxos: React.Dispatch<React.SetStateAction<UTXOSet>>;
  transactionPool: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const NodeContext = createContext<NodeContextType | null>(null);
const nodeInstance = new BlockchainNode(); // singleton

export const NodeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([...DEFAULT_WALLETS]);
  const [blocks, setBlocks] = useState<Block[]>(nodeInstance._blocks);
  const [utxos, setUtxos] = useState<UTXOSet>(nodeInstance._utxos);
  const [transactionPool, setTransactionPool] = useState<Transaction[]>(
    nodeInstance._transactionPool
  );

  wallets.forEach((wallet) => {
    wallet.connectToNode(nodeInstance);
  });

  const syncNodeUIStates = () => {
    setBlocks([...nodeInstance._blocks]);
    setUtxos(nodeInstance._utxos);
    setTransactionPool([...nodeInstance._transactionPool]);
  };

  const addWallet = (publicKey: string, privateKey: string) => {
    const wallet = new Wallet(publicKey, privateKey);
    wallet.connectToNode(nodeInstance);
    setWallets((prev) => [...prev, wallet]);
  };

  const addBlock = () => {
    nodeInstance.mineAndBroadcastBlock();
    setUtxos(nodeInstance._utxos);
    setBlocks([...nodeInstance._blocks]);
    setTransactionPool([]);
  };

  const addTransaction = (tx: Transaction) => {
    nodeInstance.addAndBroadcastTransaction(tx);
    setUtxos(nodeInstance._utxos);
    setTransactionPool([...nodeInstance._transactionPool]);
  };

  const value = {
    node: nodeInstance,
    syncNodeUIStates,
    wallets,
    addWallet,
    blocks,
    addBlock,
    setBlocks,
    utxos,
    setUtxos,
    transactionPool,
    addTransaction,
  };
  return <NodeContext.Provider value={value}>{children}</NodeContext.Provider>;
};

export const useNodeContext = () => {
  return useContext(NodeContext);
};
