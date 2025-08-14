import { createHash, verify } from "crypto";

class Transaction {
  constructor({ from, to, amount, when }) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.when = when;

    this.hash = createHash("SHA256")
      .update(from + to + amount + when)
      .digest("hex"); // hash contents as strings

    this.signature = "unsigned";
  }

  isValid() {
    return verify(
      "SHA256",
      this.hash,
      this.from,
      Buffer.from(this.signature, "base64")
    );
  }

  toJSON() {
    // for easier readability
    return {
      ...this,
      from: this.from.substr(100, 30) + "...",
      to: this.to.substr(100, 30) + "...",
      hash: this.hash.substring(0, 30) + "...",
      signature:
        this.signature != "unsigned"
          ? this.signature.substr(0, 30) + "..."
          : this.signature,
    };
  }
}

export default Transaction;
