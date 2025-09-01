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
  const proxiedBlockchain = useBlockchainContext();
  const [wallets, setWallets] = useState(() => [...DEFAULT_WALLETS]);

  useEffect(() => {
    wallets.forEach((wallet) => {
      wallet.connectToNode(proxiedBlockchain);
      wallet.calculateBalance();
    });
  }, []);

  const nodeId = useRef(uuidv4());
  return (
    <>
      <NavBar uuid={nodeId.current}></NavBar>
      <div className="grid">
        <Wallets wallets={wallets} setWallets={setWallets} />
        <Transactions wallets={wallets} />
        <Blocks wallets={wallets} />
      </div>
    </>
  );
}

export default App;
