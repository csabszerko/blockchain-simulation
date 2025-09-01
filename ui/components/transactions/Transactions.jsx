import { useState } from "react";
import { useBlockchainContext } from "../../context/BlockchainContext";

function Transactions({ wallets }) {
  const proxiedBlockchain = useBlockchainContext();

  function handleTransactionSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const from = formData.get("from");
    const sender = wallets.find((wallet) => wallet.publicKey === from);
    const to = formData.get("to");
    const amount = formData.get("amount");

    const tx = sender.createTransaction({ to, amount });
    proxiedBlockchain.addTransaction(tx);
  }

  if (!wallets || wallets.length === 0) return <h3>Transactions</h3>;

  return (
    <div>
      <h3>transactions</h3>
      <form onSubmit={handleTransactionSubmit}>
        <label htmlFor="from">from</label>
        <select name="from" id="from">
          {wallets.map((wallet) => (
            <option key={wallet.publicKey} value={wallet.publicKey}>
              {wallet.publicKey}
            </option>
          ))}
        </select>

        <label htmlFor="to">to</label>
        <select name="to" id="to">
          {wallets.map((wallet) => (
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
      <h3>pending transactions on node</h3>
      <ul>
        {proxiedBlockchain.transactionPool.map((tx) => (
          <pre key={tx.txid}>{JSON.stringify(tx, null, 2)}</pre>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
