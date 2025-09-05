import { useBlockchainContext } from "../context/BlockchainContext.jsx";
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
  const proxiedBlockchain = useBlockchainContext();
  proxiedBlockchain.nodeId = nodeId;

  const [wallets, setWallets] = useState(() => [...DEFAULT_WALLETS]);

  useEffect(() => {
    wallets.forEach((wallet) => {
      wallet.connectToNode(proxiedBlockchain);
      wallet.calculateBalance();
    });

    proxiedBlockchain.channel.postMessage({
      from: nodeId,
      to: null,
      type: "NEW_CONNECTION_SYN",
      body: null,
    });
  }, []); // useEffect runs twice in strict mode

  return (
    <>
      <NavBar nodeId={nodeId}></NavBar>
      <div className="grid">
        <Wallets wallets={wallets} setWallets={setWallets} />
        <Transactions wallets={wallets} />
        <Blocks wallets={wallets} />
      </div>
    </>
  );
}

export default App;
