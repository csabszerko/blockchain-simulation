import { useNodeContext } from "@/context/NodeContext.js";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

import "./App.css";
import Wallets from "./custom_components/wallets/Wallets.js";
import Transactions from "./custom_components/transactions/Transactions.js";
import Blocks from "./custom_components/blocks/Blocks.js";
import BlockCarousel from "./components/custom/BlockCarousel.js";
import NavBar from "./components/custom/NavBar.js";
import MineBlockSheet from "./components/custom/MineBlockSheet.js";

function App() {
  const nodeId = useRef(uuidv4()).current;
  const [syncing, setSyncing] = useState(true);
  const { node, syncNodeUIStates } = useNodeContext();
  node.nodeId = nodeId;

  useEffect(() => {
    node.channel.addEventListener("message", (e: MessageEvent) => {
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
      <NavBar nodeId={nodeId} />
      <MineBlockSheet />
      <BlockCarousel />
      <div className="grid">
        <Wallets />
        <Transactions />
        <Blocks />
      </div>
    </>
  );
}

export default App;
