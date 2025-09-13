import { useNodeContext } from "@/context/NodeContext.js";
import "./Transactions.css";

function Transactions() {
  const { transactionPool, addTransaction, connectedWallets } =
    useNodeContext();

  function handleTransactionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const from = formData.get("from");
    const sender = connectedWallets.find((wallet) => wallet.publicKey === from);
    const to = formData.get("to") as string;
    const amount = Number(formData.get("amount"));

    if (!sender) {
      console.error("No matching sender wallet");
      return;
    }

    if (!to || isNaN(amount)) {
      console.error("Invalid transaction data");
      return;
    }

    const tx = sender.createTransaction({ to, amount });
    addTransaction(tx);
  }

  if (!connectedWallets || connectedWallets.length === 0)
    return <h3>Transactions</h3>;

  return (
    <div>
      <h3>transactions</h3>
      <form onSubmit={handleTransactionSubmit}>
        <label htmlFor="from">from</label>
        <select name="from" id="from">
          {connectedWallets.map((wallet) => (
            <option key={wallet.publicKey} value={wallet.publicKey}>
              {wallet.publicKey}
            </option>
          ))}
        </select>

        <label htmlFor="to">to</label>
        <select name="to" id="to">
          {connectedWallets.map((wallet) => (
            <option key={wallet.publicKey} value={wallet.publicKey}>
              {wallet.publicKey}
            </option>
          ))}
        </select>

        <label htmlFor="amount">amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          min="1"
          defaultValue="1"
        />

        <button type="submit">create transaction</button>
      </form>
      <h3>node tx mempool</h3>
      <ul>
        {transactionPool.map((tx) => (
          <pre key={tx.txid}>{JSON.stringify(tx, null, 2)}</pre>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
