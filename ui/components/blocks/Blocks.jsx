import { useBlockchainContext } from "../../context/BlockchainContext";
import "./Blocks.css";

function Blocks() {
  const proxiedBlockchain = useBlockchainContext();
  return (
    <div>
      <h3>
        blockchain is{" "}
        {proxiedBlockchain.isBlockchainValid ? "valid" : "invalid"}
      </h3>
      <button
        onClick={() => {
          proxiedBlockchain.mineBlock();
        }}
      >
        mine block
      </button>
      <pre>{JSON.stringify(proxiedBlockchain.blocks, null, 5)}</pre>
      <h3> utxos on this node</h3>
      <pre>{JSON.stringify(proxiedBlockchain.utxos, null, 5)}</pre>
    </div>
  );
}

export default Blocks;
