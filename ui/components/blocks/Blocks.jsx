import { useNodeContext } from "../../context/NodeContext";
import "./Blocks.css";

function Blocks({ wallets }) {
  const { blocks, addBlock, utxos, node } = useNodeContext();
  return (
    <div>
      <h3> utxos on this node</h3>
      <pre>{JSON.stringify(utxos, null, 5)}</pre>
      <h3>blockchain is {node.isBlockchainValid ? "valid" : "invalid"}</h3>
      <button
        onClick={() => {
          addBlock();
        }}
      >
        mine block
      </button>
      <pre>{JSON.stringify(blocks, null, 5)}</pre>
    </div>
  );
}

export default Blocks;
