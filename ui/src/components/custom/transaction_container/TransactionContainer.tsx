import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.js";

import type Transaction from "core/transaction.js";
import TransactionInputsContainer from "./TransactionInputsContainer.js";
import TransactionOutputsContainer from "./TransactionOutputsContainer.js";
import { useNodeContext } from "@/context/NodeContext.js";
import { useEffect, useState } from "react";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { Badge } from "@/components/ui/badge.js";

export default function TransactionContainer({
  transaction,
}: {
  transaction: Transaction;
}) {
  const { node } = useNodeContext();
  const [simplifiedTransaction, setSimplifiedTransaction] = useState<{
    fromValue: string | null;
    toValue: string;
    amountValue: number;
  } | null>(null);

  useEffect(() => {
    const data = node.getSimplifiedTransaction(transaction);
    setSimplifiedTransaction(data);
  }, []);

  return (
    <Accordion
      type="single"
      collapsible
      className="border rounded-lg px-2 lg:px-5 lg:py-1"
    >
      <AccordionItem value={transaction.txid!}>
        <AccordionTrigger className="w-full flex items-center gap-4 [&>svg]:hidden">
          <div className="w-2/5 truncate">
            {simplifiedTransaction?.fromValue || "genesis"}
          </div>
          <div>→</div>
          <Badge variant="default">{simplifiedTransaction?.amountValue}</Badge>
          <div>→</div>
          <div className="w-2/5 truncate">{simplifiedTransaction?.toValue}</div>
        </AccordionTrigger>
        <AccordionContent>
          <AccordionHeader className="truncate pb-2 lg:pb-5 text-muted-foreground text-sm">
            hash: {transaction.txid!}
          </AccordionHeader>
          <Accordion
            type="single"
            collapsible
            className="rounded-md border p-1 lg:p-2 space-y-1"
          >
            <TransactionInputsContainer inputs={transaction.inputs} />
            <TransactionOutputsContainer
              outputs={transaction.outputs}
            ></TransactionOutputsContainer>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
