import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.js";

import type { UTXOSet } from "core/utxo.js";
import UtxoItemContainer from "./UtxoItemContainer.js";

export default function UtxoListContainer({ utxos }: { utxos: UTXOSet }) {
  return (
    <Table className="table-fixed w-full ">
      <TableHeader className="table-header-group">
        <TableRow>
          <TableHead className="w-2/5 md:w-4/7 truncate">txid</TableHead>
          <TableHead className="w-1/5 md:w-1/7 !text-center truncate">
            vout
          </TableHead>
          <TableHead className="w-2/5 md:w-2/7 !text-center truncate">
            amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(utxos).map(([txidVout, utxo]) => (
          <UtxoItemContainer key={txidVout} txidVout={txidVout} utxo={utxo} />
        ))}
      </TableBody>
    </Table>
  );
}
