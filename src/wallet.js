import { generateKeyPairSync, sign, createHash } from "crypto";
import Transaction from "./transaction.js";

class Wallet {
  #privateKey; // ES2020 syntax for private properties
  #connectedNode;

  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.#privateKey = privateKey;
    this.utxos = {};
  }

  static initializeKeyPair() {
    return generateKeyPairSync("rsa", {
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
      modulusLength: 2048,
    });
  }

  connectToNode(node) {
    this.#connectedNode = node;
  }

  getWalletUtxos() {
    this.utxos = this.#connectedNode.getUtxosForPkey(this.publicKey);
    return this.utxos;
  }

  calculateBalance() {
    return Object.values(this.getWalletUtxos()).reduce(
      (accumulator, UTXO) => accumulator + UTXO.amount,
      0
    );
  }

  createTransaction({ to, amount }) {
    this.getWalletUtxos();
    // a transaction can have MULTIPLE recipients because of the UTXO system -> change the current implementation TODO
    let fundsToSpend = 0;
    const inputs = [];
    const outputs = [];

    // collect enough UTXOs to cover the amount
    for (const [key, utxo] of Object.entries(this.utxos)) {
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
    outputs.push({ address: to, amount });

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

      const transactionHash = createHash("SHA256")
        .update(
          JSON.stringify({
            inputs: blankedSignatureInputs,
            outputs: transaction.outputs,
            "txid:vout": utxoTxidVout,
            address: referencedUtxo.address,
            amount: referencedUtxo.amount,
          })
        )
        .digest("hex");

      const signature = sign(
        "SHA256",
        transactionHash,
        this.#privateKey
      ).toString("base64"); // for better readability
      input.signature = signature;
    }
  }

  toString() {
    return this.publicKey + this.#privateKey;
  }
}

export default Wallet;
