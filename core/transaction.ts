import forge from "node-forge";

export type TransactionInput = {
  "txid:vout": string;
  signature: string | null;
};

export type TransactionOutput = {
  address: string;
  amount: number;
};

export default class Transaction {
  txid: string | null;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  constructor({
    txid,
    inputs,
    outputs,
  }: {
    txid?: string;
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
  }) {
    this.txid = txid ?? null;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  finalizeTxid(): void {
    this.txid = forge.md.sha256
      .create()
      .update(
        JSON.stringify({
          inputs: this.inputs,
          outputs: this.outputs,
        })
      )
      .digest()
      .toHex();
  }
}
