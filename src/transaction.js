import { createHash, verify } from "crypto";

class Transaction {
  constructor({ from, to, amount, timestamp }) {
    this.txId = null;
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = timestamp;
    this.signature = null;
  }

  finalizeTxId() {
    this.txId = createHash("SHA256")
      .update(
        JSON.stringify({
          from: this.from,
          to: this.to,
          amount: this.amount,
          timestamp: this.timestamp,
          signature: this.signature,
        })
      )
      .digest("hex");
  }

  isValid() {
    try {
      const transactionHash = createHash("SHA256")
        .update(
          JSON.stringify({
            from: this.from,
            to: this.to,
            amount: this.amount,
            timestamp: this.timestamp,
          })
        )
        .digest("hex");

      return verify(
        "SHA256",
        transactionHash,
        this.from,
        Buffer.from(this.signature, "base64")
      );
    } catch {
      return false;
    }
  }

  toJSON() {
    // for easier readability
    return {
      ...this,
      txId: this.txId ? this.txId.substr(0, 30) + "..." : this.txId,
      from: this.from.substr(100, 30) + "...",
      to: this.to.substr(100, 30) + "...",
      signature: this.signature
        ? this.signature.substr(0, 30) + "..."
        : this.signature,
    };
  }
}

export default Transaction;
