import forge from "node-forge";

class Transaction {
  constructor({ inputs, outputs }) {
    this.txid = null;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  finalizeTxid() {
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

export default Transaction;
