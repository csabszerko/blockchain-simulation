import { Separator } from "@/components/ui/separator.js";
import AddTransactionDialog from "../add_transaction/AddTransactionDialog.js";
import ConnectCreateWalletDialog from "../connect_wallet/ConnectCreateWalletDialog.js";
import MineBlockSheet from "../mine_block/MineBlockSheet.js";
import BlockCarousel from "./BlockCarousel.js";

export default function BlockViewer() {
  return (
    <div className="mx-auto max-w-6/8">
      <h1 className="text-left text-4xl font-extrabold py-3 space-y-3">
        <div className="text-left">
          block viewer
          {/* <MineBlockSheet />
          <ConnectCreateWalletDialog />
          <AddTransactionDialog /> */}
        </div>
      </h1>
      <BlockCarousel />
    </div>
  );
}
