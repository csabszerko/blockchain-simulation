import Wallet from "../../../core/wallet.js";
import { useEffect, useRef, useState } from "react";
import "./Wallets.css";
import { useNodeContext } from "../../context/NodeContext.js";

function Wallets() {
  const { wallets, addWallet, blocks } = useNodeContext();

  const [walletBalances, setWalletBalances] = useState<Record<string, number>>(
    {}
  );
  const placeholderKeys = useRef(Wallet.initializeKeyPair());

  useEffect(() => {
    const balances: Record<string, number> = {};
    wallets.forEach((wallet) => {
      balances[wallet.publicKey] = wallet.calculateBalance();
    });
    setWalletBalances(balances);
  }, [blocks, wallets]);

  function createWallet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const publicKey = formData.get("publicKey") as string;
    const privateKey = formData.get("privateKey") as string;

    addWallet(publicKey, privateKey);

    placeholderKeys.current = Wallet.initializeKeyPair();
    event.currentTarget.reset();
  }

  return (
    <div>
      <h3>wallets</h3>
      <form onSubmit={createWallet}>
        <label htmlFor="publicKey">wallet public key</label>
        <input
          id="publicKey"
          name="publicKey"
          defaultValue={placeholderKeys.current.publicKey}
        />

        <label htmlFor="privateKey">wallet private key</label>
        <input
          id="privateKey"
          name="privateKey"
          defaultValue={placeholderKeys.current.privateKey}
        />

        <button type="submit">create wallet</button>
      </form>
      <h3>wallets connected to node</h3>
      <table>
        <thead>
          <tr>
            <th>public key</th>
            <th>balance</th>
          </tr>
        </thead>
        <tbody>
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <tr key={wallet.publicKey}>
                <td>{wallet.publicKey}</td>
                <td>{walletBalances[wallet.publicKey]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No wallets</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Wallets;
