import { TableCell, TableRow } from "@/components/ui/table.js";

import { Badge } from "@/components/ui/badge.js";
import type { UTXO } from "core/utxo.js";

export default function UtxoItemContainer({
  txidVout,
  utxo,
}: {
  txidVout: string;
  utxo: UTXO;
}) {
  return (
    <TableRow
      key={txidVout}
      className={utxo.reserved ? "text-destructive italic" : ""}
    >
      <TableCell className="truncate">{txidVout.split(":")[0]}</TableCell>
      <TableCell className="!text-center truncate">
        {txidVout.split(":")[1]}
      </TableCell>
      <TableCell className="!text-center truncate">
        <Badge className={utxo.reserved ? "bg-destructive" : ""}>
          {utxo.amount}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
