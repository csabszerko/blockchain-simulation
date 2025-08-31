import React, { createContext, useContext } from "react";
import Blockchain from "../../core/blockchain";

const BlockchainContext = createContext(null);

const blockchainInstance = new Blockchain(); // singleton
export const BlockchainContextProvider = ({ children }) => {
  return (
    <BlockchainContext.Provider value={blockchainInstance}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchainContext = () => {
  return useContext(BlockchainContext);
};
