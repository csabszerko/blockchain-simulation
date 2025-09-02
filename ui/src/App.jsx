import { useBlockchainContext } from "../context/BlockchainContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";

import "./App.css";
import Wallets from "../components/wallets/Wallets.jsx";
import Transactions from "../components/transactions/Transactions.jsx";
import NavBar from "../components/navbar/NavBar.jsx";
import Blocks from "../components/Blocks/Blocks.jsx";
import { DEFAULT_WALLETS } from "../../constants/defaultData.js";
import { useBroadcastChannel } from "../hooks/useBroadcastChannel.jsx";

function App() {
  const proxiedBlockchain = useBlockchainContext();
  const [wallets, setWallets] = useState(() => [...DEFAULT_WALLETS]);
  const nodeId = useRef(uuidv4());

  const handleMessage = (message) => {
    if (message.sender === nodeId.current) return;
    console.log(message);
    if (message.type === "SYN") {
      broadcastMessage({
        sender: nodeId.current,
        type: "ACK",
      });
    }
  };
  const broadcastMessage = useBroadcastChannel("gossip", handleMessage);

  useEffect(() => {
    wallets.forEach((wallet) => {
      wallet.connectToNode(proxiedBlockchain);
      wallet.calculateBalance();
    });

    broadcastMessage({
      sender: nodeId.current,
      type: "SYN",
    });
  }, []); // useEffect runs twice in strict mode

  return (
    <>
      <NavBar uuid={nodeId.current}></NavBar>
      <div className="grid">
        <Wallets wallets={wallets} setWallets={setWallets} />
        <Transactions wallets={wallets} />
        <Blocks wallets={wallets} />
      </div>
      <button onClick={() => broadcastMessage("hello from " + nodeId.current)}>
        bc
      </button>
    </>
  );
}

export default App;
