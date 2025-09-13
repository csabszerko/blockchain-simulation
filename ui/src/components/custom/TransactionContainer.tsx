import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card.js";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.js";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.js";

import type Transaction from "core/transaction.js";
import TransactionInputsContainer from "./TransactionInputsContainer.js";
import TransactionOutputsContainer from "./TransactionOutputsContainer.js";

export default function TransactionContainer({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col text-left">
        <CardTitle>transaction</CardTitle>
        <CardDescription className="max-w-full">
          <div className="truncate"> hash: {transaction.txid}</div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <TransactionInputsContainer inputs={transaction.inputs} />
          <TransactionOutputsContainer
            outputs={transaction.outputs}
          ></TransactionOutputsContainer>
        </Accordion>
      </CardContent>
    </Card>
  );
}
