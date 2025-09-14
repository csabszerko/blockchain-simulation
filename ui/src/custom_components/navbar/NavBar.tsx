import { Button } from "@/components/ui/button.js";
import "./NavBar.css";
function NavBar({ nodeId }: { nodeId: string }) {
  return (
    <nav className="bg-card py-3 flex flex-col items-center">
      <h3 className="truncate text-center max-w-full">
        node connected as {nodeId}
      </h3>
      <div className="flex gap-2 mt-2">
        <Button
          onClick={() => {
            window.open(window.location.href);
          }}
        >
          connect new node
        </Button>
        <Button variant="outline" onClick={() => location.reload()}>
          sync this node
        </Button>
      </div>
    </nav>
  );
}

export default NavBar;
