import { Button } from "@/components/ui/button.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";

import Wallet from "core/wallet.js";
import { useRef } from "react";
import { useNodeContext } from "@/context/NodeContext.js";

export default function ConnectCreateWalletDialog() {
  const { createWallet } = useNodeContext();

  const placeholderKeys = useRef(Wallet.initializeKeyPair());

  function submitWalletHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const publicKey = formData.get("publicKey") as string;
    const privateKey = formData.get("privateKey") as string;

    createWallet(publicKey, privateKey);

    placeholderKeys.current = Wallet.initializeKeyPair();
    event.currentTarget.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">connect wallet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submitWalletHandler}>
          <DialogHeader className="pb-10">
            <DialogTitle>connect wallet</DialogTitle>
            <DialogDescription>
              enter your credentials or randomize a wallet
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4">
              <Label htmlFor="publicKey">public key</Label>
              <Input
                id="publicKey"
                name="publicKey"
                defaultValue={placeholderKeys.current.publicKey}
                required
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="privateKey">private key</Label>
              <Input
                id="privateKey"
                name="privateKey"
                defaultValue={placeholderKeys.current.privateKey}
                required
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
      </DialogContent>
    </Dialog>
  );
}
