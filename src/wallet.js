import { generateKeyPairSync, sign } from "crypto";

class Wallet {
  #privateKey; // ES2020 syntax for private properties

  constructor() {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
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

    this.#privateKey = privateKey;
    this.publicKey = publicKey;
  }

  signTransaction(transaction) {
    // only if this user is the sender
    if (transaction.from === this.publicKey) {
      const signature = sign(
        "SHA256",
        transaction.hash,
        this.#privateKey
      ).toString("base64"); // for better readability
      transaction.signature = signature;
    }
  }
}

export default Wallet;
