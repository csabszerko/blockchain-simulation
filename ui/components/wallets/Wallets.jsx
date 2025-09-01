import Wallet from "../../../core/wallet";
import { useEffect } from "react";
import "./Wallets.css";
import { useBlockchainContext } from "../../context/BlockchainContext";

function Wallets({ wallets, setWallets }) {
  const proxiedBlockchain = useBlockchainContext();
  const placeholderKeys = Wallet.initializeKeyPair();

  function createWallet(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const publicKey = formData.get("publicKey");
    const privateKey = formData.get("privateKey");

    const wallet = new Wallet(publicKey, privateKey);
    wallet.connectToNode(proxiedBlockchain);

    setWallets((prev) => [...prev, wallet]);
    event.target.reset();
  }

  return (
    <div>
      <h3>wallets</h3>
      <form onSubmit={createWallet}>
        <label htmlFor="publicKey">wallet public key</label>
        <input
          id="publicKey"
          name="publicKey"
          defaultValue={placeholderKeys.publicKey}
        />

        <label htmlFor="privateKey">wallet private key</label>
        <input
          id="privateKey"
          name="privateKey"
          defaultValue={placeholderKeys.privateKey}
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
          {wallets.map((wallet) => (
            <tr key={wallet.publicKey}>
              <td>{wallet.publicKey}</td>
              <td>{wallet.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Wallets;
