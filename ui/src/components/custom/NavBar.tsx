import { Navbar01 } from "@/components/ui/navbar-01/index.js";

const NavBar = ({ nodeId }: { nodeId: string }) => (
  <div className="relative w-full">
    <Navbar01 nodeId={nodeId} />
  </div>
);
export default NavBar;
