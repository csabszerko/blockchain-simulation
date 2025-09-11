import forge from "node-forge";
import { Buffer } from "buffer";
import { toHex } from "./utils.js";
import Transaction, {
  type TransactionInput,
  type TransactionOutput,
} from "./transaction.js";
import type Blockchain from "./blockchain.js";
import type { UTXO, UTXOSet } from "./utxo.js";

class Wallet {
  public publicKey: string;
  public utxos: UTXOSet;
  private privateKey: string; // ES2020 syntax for private properties
  private connectedNode: Blockchain | null;

  constructor(publicKey: string, privateKey: string) {
    this.utxos = {};
    this.connectedNode = null;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  static initializeKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = forge.pki.ed25519.generateKeyPair();
    return {
      publicKey: toHex(publicKey),
      privateKey: toHex(privateKey),
    };
  }

  connectToNode(node: Blockchain) {
    this.connectedNode = node;
  }

  getWalletUtxos(includeReserved: boolean): UTXOSet {
    if (!this.connectedNode) {
      throw new Error("Wallet is not connected to any node");
    }
    return this.connectedNode.getUtxosForPkey(this.publicKey, includeReserved);
  }

  calculateBalance(): number {
    const utxos = this.getWalletUtxos(true);
    const balance = Object.values(utxos).reduce(
      (accumulator: number, UTXO: UTXO) => accumulator + UTXO.amount,
      0
    );
    return balance;
  }

  createTransaction({
    to,
    amount,
  }: {
    to: string;
    amount: number;
  }): Transaction {
    this.utxos = this.getWalletUtxos(false);
    // a transaction can have MULTIPLE recipients because of the UTXO system -> change the current implementation TODO
    let fundsToSpend = 0;
    const inputs: TransactionInput[] = [];
    const outputs: TransactionOutput[] = [];

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

    this.signTransactionInputs(transaction);
    transaction.finalizeTxid();
    return transaction;
  }

  private signTransactionInputs(transaction: Transaction): void {
    // at this point all of the signatures are blank in the inputs
    const blankedSignatureInputs: TransactionInput[] = transaction.inputs.map(
      (input) => ({
        ...input,
        signature: null,
      })
    );

    for (const input of transaction.inputs) {
      const utxoTxidVout = input["txid:vout"];
      const referencedUtxo = this.utxos[utxoTxidVout];

      if (!referencedUtxo)
        throw new Error(
          "Failed to sign transaction: referenced UTXO could not be found in wallet's UTXO set"
        );

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
          privateKey: Buffer.from(this.privateKey, "hex"),
        })
      );

      input.signature = signature;
    }
  }

  toString(): string {
    return this.publicKey + this.privateKey;
  }
}

export default Wallet;
