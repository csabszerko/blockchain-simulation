import type Block from "core/block.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card.js";
import TransactionContainer from "./TransactionContainer.js";
import BlockHashCurve from "./BlockHashCurve.js";
export default function BlockCard({ block }: { block: Block }) {
  return (
    <div className="relative">
      {block.index > 0 ? <BlockHashCurve /> : null}
      <Card className="w-full text-left">
        <CardHeader className="flex flex-col">
          <CardTitle className="font-bold">
            block {block.index || "genesis"}
          </CardTitle>
          <CardDescription className="max-w-full">
            <div className="truncate">hash: {block.hash}</div>
            <div className="truncate">
              previous block's hash: {block.previousHash}
            </div>
            <div>nonce: {block.nonce}</div>
            <div>created at: {new Date(block.timestamp).toLocaleString()}</div>
          </CardDescription>
        </CardHeader>
        {block.transactions.length ? (
          <CardContent className="space-y-2">
            <div className="font-semibold">transactions</div>
            {block.transactions.map((tx) => (
              <TransactionContainer key={tx.txid} transaction={tx} />
            ))}
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
