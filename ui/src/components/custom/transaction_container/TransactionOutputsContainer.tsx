import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.js";
import type { TransactionOutput } from "core/transaction.js";

export default function TransactionOutputsContainer({
  outputs,
}: {
  outputs: TransactionOutput[];
}) {
  return outputs.length > 0 ? (
    <AccordionItem value="outputs">
      <AccordionTrigger className="p-1">outputs</AccordionTrigger>
      <AccordionContent className="lg:p-1">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-4/6">address</TableHead>
              <TableHead className="w-2/6 !text-center">amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outputs.map((output) => (
              <TableRow key={output.address + output.amount}>
                <TableCell className="truncate">{output.address}</TableCell>
                <TableCell className="!text-center">{output.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  ) : null;
}
