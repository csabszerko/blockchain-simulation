import { Button } from "@/components/ui/button.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.js";
import { Cog, Info } from "lucide-react";
import ThemeToggle from "../misc/ThemeToggle.js";
import { Badge } from "@/components/ui/badge.js";

export function NetworkInfoPopover({ nodeId }: { nodeId: string }) {
  return (
    <Popover modal>
      <PopoverTrigger className="hover:cursor-pointer">
        <Info />
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <div className="flex justify-between items-center">
          <div>node settings</div>
          <ThemeToggle />
        </div>
        <Badge variant="default" className="w-full">
          {nodeId}
        </Badge>
        <Button
          className="w-full"
          onClick={() => {
            location.reload();
          }}
        >
          reconnect to network (sync)
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            window.open(window.location.href);
          }}
        >
          connect new node
        </Button>
      </PopoverContent>
    </Popover>
  );
}
