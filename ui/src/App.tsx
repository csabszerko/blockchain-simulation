import { useNodeContext } from "@/context/NodeContext.js";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

import "./App.css";
import BlockCarousel from "./components/custom/block_viewer/BlockCarousel.js";
import MineBlockSheet from "./components/custom/mine_block/MineBlockSheet.js";
import ConnectCreateWalletDialog from "./components/custom/connect_wallet/ConnectCreateWalletDialog.js";
import AddTransactionDialog from "./components/custom/add_transaction/AddTransactionDialog.js";
import { Navbar01 } from "./components/ui/navbar-01/index.js";
import BlockViewer from "./components/custom/block_viewer/BlockViewer.js";

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
      <Navbar01 nodeId={nodeId} />
      <BlockViewer />
    </>
  );
}

export default App;
