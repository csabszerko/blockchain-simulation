import { cn } from "@/lib/utils.js";
import MineBlockSheet from "@/components/custom/mine_block/MineBlockSheet.js";
import ConnectCreateWalletDialog from "@/components/custom/connect_wallet/ConnectCreateWalletDialog.js";
import AddTransactionDialog from "@/components/custom/add_transaction/AddTransactionDialog.js";
import { NetworkInfoPopover } from "./networkInfoPopover.js";
import { Bitcoin, Github } from "lucide-react";

export const Navbar01 = ({ nodeId }: { nodeId: string }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between ">
        {/* Left side */}
        <div className="flex items-center">
          {/* Main nav */}
          <div className="flex items-center gap-1 hidden md:flex">
            <button
              onClick={(e) =>
                window.open(
                  "https://github.com/csabszerko/blockchain-simulation"
                )
              }
              className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
            >
              <span className="hidden text-xl sm:inline-flex flex items-center gap-2">
                <Github />
                <div>github.com/csabszerko</div>
              </span>
            </button>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3 justify-center md:justify-end w-full">
          <ConnectCreateWalletDialog />
          <AddTransactionDialog />
          <MineBlockSheet />
          <span className="hidden sm:flex">
            <NetworkInfoPopover nodeId={nodeId} />
          </span>
        </div>
      </div>
    </header>
  );
};
