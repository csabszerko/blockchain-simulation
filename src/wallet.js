import { generateKeyPairSync, sign, createHash } from "crypto";
import Transaction from "./transaction.js";

class Wallet {
  #privateKey; // ES2020 syntax for private properties

  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.#privateKey = privateKey;
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

  createTransaction({ to, amount }) {
    const transaction = new Transaction({
      from: this.publicKey,
      to: to,
      amount: amount,
      timestamp: Date.now(),
    });
    this.#signTransaction(transaction);
    transaction.finalizeTxId();
    return transaction;
  }

  #signTransaction(transaction) {
    const transactionHash = createHash("SHA256")
      .update(
        JSON.stringify({
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount,
          timestamp: transaction.timestamp,
        })
      )
      .digest("hex"); // hash contents as strings

    // only if this user is the sender
    if (transaction.from === this.publicKey) {
      const signature = sign(
        "SHA256",
        transactionHash,
        this.#privateKey
      ).toString("base64"); // for better readability
      transaction.signature = signature;
    }
  }

  toString() {
    return this.publicKey + this.#privateKey;
  }
}

export default Wallet;
