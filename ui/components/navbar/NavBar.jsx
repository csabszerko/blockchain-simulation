import { useNodeContext } from "../../context/NodeContext";
import "./NavBar.css";
function NavBar({ nodeId }) {
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
      <button onClick={() => location.reload()}>sync with other nodes</button>
    </nav>
  );
}

export default NavBar;
