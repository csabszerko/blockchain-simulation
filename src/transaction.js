import { createHash } from "crypto";

class Transaction {
  constructor({ inputs, outputs }) {
    this.txid = null;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  finalizeTxid() {
    this.txid = createHash("SHA256")
      .update(
        JSON.stringify({
          inputs: this.inputs,
          outputs: this.outputs,
        })
      )
      .digest("hex");
  }
}

export default Transaction;
