import Transaction from "./transaction.js";
import forge from "node-forge";
import { Buffer } from "buffer";
import { toHex } from "./utils.js";

class Wallet {
  #privateKey; // ES2020 syntax for private properties
  #connectedNode;

  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.#privateKey = privateKey;
    this.utxos = {};
    this.balance = 0;
  }

  static initializeKeyPair() {
    const { publicKey, privateKey } = forge.pki.ed25519.generateKeyPair();
    return {
      publicKey: toHex(publicKey),
      privateKey: toHex(privateKey),
    };
  }

  connectToNode(node) {
    this.#connectedNode = node;
  }

  getWalletUtxos() {
    this.utxos = this.#connectedNode.getUtxosForPkey(this.publicKey);
    return this.utxos;
  }

  calculateBalance() {
    const utxos = this.getWalletUtxos();
    const balance = Object.values(utxos).reduce(
      (accumulator, UTXO) => accumulator + Number(UTXO.amount),
      0
    );
    this.balance = balance;
    return balance;
  }

  createTransaction({ to, amount }) {
    this.getWalletUtxos();
    // a transaction can have MULTIPLE recipients because of the UTXO system -> change the current implementation TODO
    let fundsToSpend = 0;
    const inputs = [];
    const outputs = [];

    // collect enough UTXOs to cover the amount
    for (const [key, utxo] of Object.entries(this.utxos)) {
      console.log("currently processing ", key);
      if (fundsToSpend >= amount) break;
      fundsToSpend += utxo.amount;
      inputs.push({
        "txid:vout": key,
        signature: null,
      });
    }

    if (fundsToSpend < amount) {
      throw new Error("Transaction failed: insufficient funds in wallet");
    }

    // always add recipient output
    outputs.push({ address: to, amount: Number(amount) });

    // add change output if needed
    const change = fundsToSpend - amount;
    if (change > 0) {
      outputs.push({ address: this.publicKey, amount: change });
    }

    const transaction = new Transaction({
      inputs: inputs,
      outputs: outputs,
    });

    this.#signTransactionInputs(transaction);
    transaction.finalizeTxid();
    return transaction;
  }

  #signTransactionInputs(transaction) {
    // at this point all of the signatures are blank in the inputs
    const blankedSignatureInputs = transaction.inputs.map((input) => ({
      ...input,
      signature: null,
    }));

    for (const input of transaction.inputs) {
      const utxoTxidVout = input["txid:vout"];
      const referencedUtxo = this.utxos[utxoTxidVout];

      const transactionHash = forge.md.sha256
        .create()
        .update(
          JSON.stringify({
            inputs: blankedSignatureInputs,
            outputs: transaction.outputs,
            "txid:vout": utxoTxidVout,
            address: referencedUtxo.address,
            amount: referencedUtxo.amount,
          })
        )
        .digest()
        .toHex();

      const signature = toHex(
        forge.pki.ed25519.sign({
          // also accepts a forge ByteBuffer or Uint8Array
          message: Buffer.from(transactionHash, "hex"),
          privateKey: Buffer.from(this.#privateKey, "hex"),
        })
      );

      input.signature = signature;
    }
  }

  toString() {
    return this.publicKey + this.#privateKey;
  }
}

export default Wallet;
