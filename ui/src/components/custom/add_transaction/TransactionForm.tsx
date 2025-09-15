import { Button } from "@/components/ui/button.js";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.js";
import { Input } from "@/components/ui/input.js";

import { useNodeContext } from "@/context/NodeContext.js";

import WalletSelectorComboBox from "./WalletSelectorComboBox.js";

export default function TransactionForm({
  fromValue,
  setFromValue,
  toValue,
  setToValue,
}: {
  fromValue: string;
  setFromValue: (value: string) => void;
  toValue: string;
  setToValue: (value: string) => void;
}) {
  const { addTransaction, connectedWallets } = useNodeContext();

  function handleTransactionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const from = formData.get("from");
    const sender = connectedWallets.find((wallet) => wallet.publicKey === from);
    const to = formData.get("to") as string;
    const amount = Number(formData.get("amount"));

    const tx = sender!.createTransaction({ to, amount });
    addTransaction(tx);
  }
  return (
    <form
      onSubmit={handleTransactionSubmit}
      className="flex flex-col justify-between h-full"
    >
      <DialogHeader className="pb-2">
        <DialogTitle>transaction</DialogTitle>
        <DialogDescription>
          choose sender and recipient wallets
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <input type="hidden" name="from" value={fromValue} />
          <WalletSelectorComboBox
            value={fromValue}
            setValue={setFromValue}
            wallets={connectedWallets}
          />
        </div>
        <div className="text-center select-none">↓</div>
        <div className="text-center flex justify-center">
          <Input
            id="amount"
            name="amount"
            type="number"
            required
            className="border rounded-md w-20 border-primary !bg-primary text-secondary text-center"
            min={1}
            defaultValue={1}
          />
        </div>
        <div className="text-center select-none">↓</div>
        <div>
          <input type="hidden" name="to" value={toValue} />
          <WalletSelectorComboBox
            value={toValue}
            setValue={setToValue}
            wallets={connectedWallets}
          />
        </div>
      </div>
      <div className="pt-2 flex flex-col space-y-2">
        <Button type="submit" className="w-full">
          add transaction
        </Button>
        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            close
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}
