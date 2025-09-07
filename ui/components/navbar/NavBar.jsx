import { useNodeContext } from "../../context/NodeContext";
import "./NavBar.css";
function NavBar({ nodeId }) {
  const proxiedBlockchain = useNodeContext();
  return (
    <nav>
      <h3>node connected as {nodeId}</h3>
      <button
        onClick={() => {
          window.open(window.location.href);
        }}
      >
        connect new node
      </button>
      <button
        onClick={() => {
          proxiedBlockchain.channel.postMessage({
            from: nodeId,
            to: null,
            type: "NEW_CONNECTION_SYN",
            body: null,
          });
        }}
      >
        sync with other nodes
      </button>
    </nav>
  );
}

export default NavBar;
