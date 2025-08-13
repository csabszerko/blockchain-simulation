class Transaction {
  constructor({ from, to, amount, when }) {
    this.from = from;
    this.to = to;
    this.amout = amount;
    this.when = when;
  }
}

export default Transaction;
