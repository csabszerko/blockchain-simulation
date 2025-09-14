import type Block from "core/block.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card.js";
import TransactionContainer from "./TransactionContainer.js";
export default function BlockCard({ block }: { block: Block }) {
  return (
    <div className="relative">
      {/* Decorative curve */}
      {block.index > 0 ? (
        <svg
          className="absolute pointer-events-none -left-5 top-14 z-[-1] overflow-visible"
          width="200"
          height="100"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--muted-foreground)" />{" "}
              {/* Tailwind red-400 */}
              <stop offset="100%" stopColor="var(--color-primary)" />{" "}
              {/* Tailwind blue-400 */}
            </linearGradient>
          </defs>
          <path
            d="M 2 0 C 23 0 2 21 23 21"
            stroke="url(#lineGradient)"
            strokeWidth="3px"
            fill="none"
          />
        </svg>
      ) : null}
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
