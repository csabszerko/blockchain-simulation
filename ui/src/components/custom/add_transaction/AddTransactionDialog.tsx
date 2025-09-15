import { Button } from "@/components/ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.js";
import { useState } from "react";
import { useNodeContext } from "@/context/NodeContext.js";
import UtxoPanel from "./UtxoPanel.js";
import TransactionForm from "./TransactionForm.js";

export default function AddTransactionDialog() {
  const { connectedWallets } = useNodeContext();

  const [fromValue, setFromValue] = useState(
    connectedWallets[0]?.publicKey || ""
  );
  const [toValue, setToValue] = useState(connectedWallets[0]?.publicKey || "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">add transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <div className="grid grid-cols-2 gap-6">
          <UtxoPanel selectedWalletPublicKey={fromValue} />
          <TransactionForm
            fromValue={fromValue}
            setFromValue={setFromValue}
            toValue={toValue}
            setToValue={setToValue}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
