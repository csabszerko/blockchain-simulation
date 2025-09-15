import { Button } from "@/components/ui/button.js";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils.js";
import { Badge } from "@/components/ui/badge.js";
import ThemeToggle from "@/components/custom/misc/ThemeToggle.js";
import MineBlockSheet from "@/components/custom/mine_block/MineBlockSheet.js";
import ConnectCreateWalletDialog from "@/components/custom/connect_wallet/ConnectCreateWalletDialog.js";
import AddTransactionDialog from "@/components/custom/add_transaction/AddTransactionDialog.js";

export const Navbar01 = ({ nodeId }: { nodeId: string }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={(e) =>
                window.open(
                  "https://github.com/csabszerko/blockchain-simulation"
                )
              }
              className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
            >
              <span className="hidden text-xl sm:inline-block">
                github.com/csabszerko
              </span>
            </button>
            <MineBlockSheet />
            <ConnectCreateWalletDialog />
            <AddTransactionDialog />
          </div>
          {/* 
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-extrabold">blockchain simulation</h1>
            <Badge variant={"secondary"}>{nodeId}</Badge>
          </div> */}
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => {
              window.open(window.location.href);
            }}
          >
            connect new node
          </Button>
          <Button
            size="sm"
            className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
            onClick={(e) => {
              location.reload();
            }}
          >
            sync with network
          </Button>
        </div>
      </div>
    </header>
  );
};
