import Wallet from "core/wallet.js";
import { useEffect, useRef, useState } from "react";
import "./Wallets.css";
import { useNodeContext } from "@/context/NodeContext.js";

function Wallets() {
  const { createWallet, blocks, node, connectedWallets } = useNodeContext();

  const [walletBalancesMap, setWalletBalancesMap] = useState<
    Record<string, number>
  >({});
  const placeholderKeys = useRef(Wallet.initializeKeyPair());

  useEffect(() => {
    const balancesMap: Record<string, number> = {};
    node.collectAllWalletAddressesOnChain().forEach((address) => {
      balancesMap[address] = node.calculateBalanceForWallet(address);
    });
    setWalletBalancesMap(balancesMap);
  }, [blocks, connectedWallets]);

  function submitWalletHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const publicKey = formData.get("publicKey") as string;
    const privateKey = formData.get("privateKey") as string;

    createWallet(publicKey, privateKey);

    placeholderKeys.current = Wallet.initializeKeyPair();
    event.currentTarget.reset();
  }

  return (
    <div>
      <h3>wallets</h3>
      <form onSubmit={submitWalletHandler}>
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
      <h3>wallet balances on chain</h3>
      <table>
        <thead>
          <tr>
            <th>public key</th>
            <th>balance</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(walletBalancesMap).length > 0 ? (
            Object.entries(walletBalancesMap).map(([address, balance]) => (
              <tr key={address}>
                <td>{address}</td>
                <td>{balance}</td>
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
