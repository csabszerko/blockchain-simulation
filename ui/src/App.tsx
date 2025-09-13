import { useNodeContext } from "../context/NodeContext.js";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

import "./App.css";
import Wallets from "../components/wallets/Wallets.js";
import Transactions from "../components/transactions/Transactions.js";
import NavBar from "../components/navbar/NavBar.js";
import Blocks from "../components/blocks/Blocks.js";

function App() {
  const nodeId = useRef(uuidv4()).current;
  const [syncing, setSyncing] = useState(true);
  const { node, syncNodeUIStates } = useNodeContext();
  node.nodeId = nodeId;

  useEffect(() => {
    node.channel.addEventListener("message", (e) => {
      if (e.data.type === "NEW_BLOCK" || e.data.type === "NEW_TRANSACTION") {
        syncNodeUIStates();
      }
    });
    (async () => {
      await node.broadcastSyncRequest(nodeId, 1000);
      syncNodeUIStates();
      setSyncing(false);
    })();
  }, []);

  if (syncing) {
    return <div className="syncing">syncing with the network...</div>;
  }

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
