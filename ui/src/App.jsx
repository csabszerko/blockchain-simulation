import { useBlockchainContext } from "../context/BlockchainContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import NavBar from "../components/navbar/NavBar.jsx";
import "./App.css";

function App() {
  const proxiedBlockchain = useBlockchainContext();
  const nodeId = useRef(uuidv4());
  return (
    <>
      <NavBar uuid={nodeId.current}></NavBar>
      <div>blocks on the blockchain:</div>
      <pre>{JSON.stringify(proxiedBlockchain.blocks, null, 5)}</pre>
      <button
        onClick={() => {
          proxiedBlockchain.blocks = [...proxiedBlockchain.blocks, "new block"];
        }}
      >
        add new block
      </button>
    </>
  );
}

export default App;
