import type Block from "core/block.js";
import "./BlockCard.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card.js";
import TransactionContainer from "../transaction_container/TransactionContainer.js";
import BlockHashCurve from "./BlockHashCurve.js";
import { ArrowRightLeft, Cuboid } from "lucide-react";
import { Badge } from "@/components/ui/badge.js";
export default function BlockCard({ block }: { block: Block }) {
  return (
    <div className="relative fade-in">
      {block.index > 0 ? <BlockHashCurve /> : null}
      <Card className="w-full text-left">
        <CardHeader className="flex flex-col">
          <CardTitle className="font-bold"></CardTitle>
          <div className="flex items-center gap-2">
            block <Badge variant="outline">{block.index || "genesis"}</Badge>
          </div>
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
            <div className="flex items-center gap-2">
              <div className="font-semibold">transactions</div>
              <ArrowRightLeft size={14} />
            </div>

            {block.transactions.map((tx) => (
              <TransactionContainer key={tx.txid} transaction={tx} />
            ))}
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
