import { useNodeContext } from "../../context/NodeContext.js";
import "./NavBar.css";
function NavBar({ nodeId }: { nodeId: string}) {
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
      <button onClick={() => location.reload()}>sync this node</button>
    </nav>
  );
}

export default NavBar;
