import { createContext, useContext, useState } from "react";
import BlockchainNode from "../../core/blockchainNode";
import { DEFAULT_WALLETS } from "../../constants/defaultData";
import Wallet from "../../core/wallet";

const NodeContext = createContext(null);
const nodeInstance = new BlockchainNode(); // singleton

export const NodeContextProvider = ({ children }) => {
  const [wallets, setWallets] = useState([...DEFAULT_WALLETS]);
  const [blocks, setBlocks] = useState(nodeInstance.blocks);
  const [utxos, setUtxos] = useState(nodeInstance.utxos);
  const [transactionPool, setTransactionPool] = useState(
    nodeInstance.transactionPool
  );

  wallets.forEach((wallet) => {
    wallet.connectToNode(nodeInstance);
  });

  const addWallet = (publicKey, privateKey) => {
    const wallet = new Wallet(publicKey, privateKey);
    wallet.connectToNode(nodeInstance);
    setWallets((prev) => [...prev, wallet]);
  };

  const addBlock = () => {
    nodeInstance.mineAndBroadcastBlock();
    setUtxos(nodeInstance.utxos);
    setBlocks([...nodeInstance.blocks]);
    setTransactionPool([]);
  };

  const addTransaction = (tx) => {
    nodeInstance.addAndBroadcastTransaction(tx);
    setUtxos(nodeInstance.utxos);
    setTransactionPool([...nodeInstance.transactionPool]);
  };

  const value = {
    node: nodeInstance,
    wallets,
    addWallet,
    blocks,
    addBlock,
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
