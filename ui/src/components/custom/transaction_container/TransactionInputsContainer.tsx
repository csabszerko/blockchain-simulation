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
import type { TransactionInput } from "core/transaction.js";

export default function TransactionInputsContainer({
  inputs,
}: {
  inputs: TransactionInput[];
}) {
  return inputs.length > 0 ? (
    <AccordionItem value="inputs" className="pb-1">
      <AccordionTrigger className="p-1">inputs</AccordionTrigger>
      <AccordionContent className="p-1">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5">txid</TableHead>
              <TableHead className="w-1/5 !text-center">vout</TableHead>
              <TableHead className="w-2/5">signature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.map((input) => (
              <TableRow key={input["txid:vout"]}>
                <TableCell>{input["txid:vout"].split(":")[0]}</TableCell>
                <TableCell className="!text-center">
                  {input["txid:vout"].split(":")[1]}
                </TableCell>
                <TableCell className="truncate">{input.signature}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  ) : null;
}
