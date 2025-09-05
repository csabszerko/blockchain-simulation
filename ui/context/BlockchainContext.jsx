import React, { createContext, useContext, useState } from "react";
import BlockchainNode from "../../core/blockchainNode";

const BlockchainContext = createContext(null);

const blockchainInstance = new BlockchainNode(); // singleton

export const BlockchainContextProvider = ({ children }) => {
  const [, forceUpdate] = useState(0);

  // intercept changes to the blockchain and trigger ui changes
  const proxiedBlockchain = new Proxy(blockchainInstance, {
    get(target, prop) {
      // intercepting functions
      const value = target[prop];
      if (typeof value === "function") {
        return (...args) => {
          const result = value.apply(target, args);
          forceUpdate((n) => n + 1); // update react state
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
