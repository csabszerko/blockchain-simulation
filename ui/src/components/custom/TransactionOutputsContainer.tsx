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
              <TableHead className="w-2/6">amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outputs.map((output) => (
              <TableRow key={output.address + output.amount}>
                <TableCell>{output.address}</TableCell>
                <TableCell>{output.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  ) : null;
}
