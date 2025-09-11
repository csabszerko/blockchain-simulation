import forge from "node-forge";

export interface TransactionInput {
  "txid:vout": string;
  signature: string;
}

export interface TransactionOutput {
  address: string;
  amount: number;
}

export default class Transaction {
  txid: string | null;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  constructor({
    inputs,
    outputs,
  }: {
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
  }) {
    this.txid = null;
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
