import { Button } from "@/components/ui/button.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";

import Wallet from "core/wallet.js";
import { useEffect, useRef, useState } from "react";
import { useNodeContext } from "@/context/NodeContext.js";

export default function ConnectCreateWallet() {
  const { createWallet, blocks, node, connectedWallets } = useNodeContext();

  const [walletBalancesMap, setWalletBalancesMap] = useState<
    Record<string, number>
  >({});
  const placeholderKeys = useRef(Wallet.initializeKeyPair());

  useEffect(() => {
    const balancesMap: Record<string, number> = {};
    node.collectAllWalletAddressesOnChain().forEach((address) => {
      balancesMap[address] = node.calculateBalanceForWallet(address);
    });
    setWalletBalancesMap(balancesMap);
  }, [blocks, connectedWallets]);

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
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="privateKey">private key</Label>
              <Input
                id="privateKey"
                name="privateKey"
                defaultValue={placeholderKeys.current.privateKey}
              />
            </div>
          </div>
          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button variant="outline">cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">connect</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
