import { useNodeContext } from "../context/NodeContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

import "./App.css";
import Wallets from "../components/wallets/Wallets.jsx";
import Transactions from "../components/transactions/Transactions.jsx";
import NavBar from "../components/navbar/NavBar.jsx";
import Blocks from "../components/Blocks/Blocks.jsx";
import { DEFAULT_WALLETS } from "../../constants/defaultData.js";

function App() {
  const nodeId = useRef(uuidv4()).current;
  const { node } = useNodeContext();
  node.nodeId = nodeId;

  useEffect(() => {
    node.broadcastNewConnectionSyncReq(nodeId, 2000);
  });

  return (
    <>
      <NavBar nodeId={nodeId}></NavBar>
      <div className="grid">
        <Wallets />
        <Transactions />
        <Blocks />
      </div>
    </>
  );
}

export default App;
