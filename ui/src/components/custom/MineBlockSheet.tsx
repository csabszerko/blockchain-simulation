import { Button } from "@/components/ui/button.js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.js";
import { ScrollArea } from "../ui/scroll-area.js";
import { useNodeContext } from "@/context/NodeContext.js";
import TransactionContainer from "./TransactionContainer.js";

export default function MineBlockSheet() {
  const { transactionPool, addBlock } = useNodeContext();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">mine block</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pb-0">
          <SheetTitle>node mempool</SheetTitle>
          <SheetDescription>
            these are the transactions that will be included in this block
          </SheetDescription>
        </SheetHeader>
        {transactionPool.length > 0 ? (
          <ScrollArea className="border-y overflow-auto h-full p-3">
            <div className="flex flex-col gap-3">
              {transactionPool.map((tx) => (
                <TransactionContainer key={tx.txid} transaction={tx} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            mempool is empty
          </div>
        )}

        <SheetFooter className="pt-0">
          <SheetClose>
            <Button className="w-full" type="submit" onClick={addBlock}>
              mine block
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
