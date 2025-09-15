import { useNodeContext } from "@/context/NodeContext.js";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

import "./App.css";
import { Navbar01 } from "./components/custom/navbar/Navbar01.js";
import BlockViewer from "./components/custom/block_viewer/BlockViewer.js";
import { toast, Toaster } from "sonner";
import { useTheme } from "./components/theme-provider.js";

function App() {
  const nodeId = useRef(uuidv4()).current;
  const [syncing, setSyncing] = useState(true);
  const { node, syncNodeUIStates } = useNodeContext();
  const { theme } = useTheme();
  node.nodeId = nodeId;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      toast(`received message: ${e.data.type}`, {
        description: `from ${e.data.from}`,
      });
      if (e.data.type === "NEW_BLOCK" || e.data.type === "NEW_TRANSACTION") {
        syncNodeUIStates();
      }
    };
    node.channel.addEventListener("message", handler);
    (async () => {
      await node.broadcastSyncRequest(nodeId, 1000);
      syncNodeUIStates();
      setSyncing(false);
    })();
    return () => {
      node.channel.removeEventListener("message", handler);
    };
  }, []);

  return (
    <>
      <Toaster
        className="select-none"
        position="top-center"
        theme={theme}
        duration={6000}
      />
      {syncing ? (
        <div className="syncing">syncing with the network...</div>
      ) : (
        <>
          <Navbar01 nodeId={nodeId} />
          <BlockViewer />
        </>
      )}
    </>
  );
}

export default App;
