import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../ui/dialog.js";
import { ScrollArea } from "../../ui/scroll-area.js";
import UtxoListContainer from "./UtxoListContainer.js";
import { useNodeContext } from "@/context/NodeContext.js";

export default function UtxoPanel({
  selectedWalletPublicKey,
}: {
  selectedWalletPublicKey: string;
}) {
  const { connectedWallets } = useNodeContext();
  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="pb-2">
        <DialogTitle>available utxos</DialogTitle>
        <DialogDescription>
          wallet balance:{" "}
          {connectedWallets
            .find((wallet) => wallet.publicKey === selectedWalletPublicKey)
            ?.calculateBalance()}{" "}
          shmackaroo(s)
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="flex-1 overflow-auto rounded-md border">
        <div className="h-20">
          {(() => {
            const selectedWalletUtxos =
              connectedWallets
                .find((wallet) => wallet.publicKey === selectedWalletPublicKey)
                ?.getWalletUtxos(true) || {};
            if (Object.keys(selectedWalletUtxos).length === 0) {
              return (
                <div className="h-full flex justify-center text-center pt-35">
                  <div className="text-muted-foreground">
                    no utxos available for wallet
                  </div>
                </div>
              );
            }
            return <UtxoListContainer utxos={selectedWalletUtxos} />;
          })()}
        </div>
      </ScrollArea>
    </div>
  );
}
