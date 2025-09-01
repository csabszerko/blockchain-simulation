import React, { createContext, useContext, useState } from "react";
import Blockchain from "../../core/blockchain";

const BlockchainContext = createContext(null);

const blockchainInstance = new Blockchain(); // singleton

export const BlockchainContextProvider = ({ children }) => {
  const [blocks, setBlocks] = useState(blockchainInstance.blocks);

  // intercept changes to the blockchain and trigger ui changes
  const proxiedBlockchain = new Proxy(blockchainInstance, {
    get(target, prop) {
      // intercepting functions
      const value = target[prop];
      if (typeof value === "function") {
        return (...args) => {
          const result = value.apply(target, args);
          setBlocks(target.blocks); // update react state
          return result;
        };
      }
      return value;
    },
  });
  return (
    <BlockchainContext.Provider value={proxiedBlockchain}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchainContext = () => {
  return useContext(BlockchainContext);
};
