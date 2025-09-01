import Wallet from "../core/wallet.js";

export const WALLET1 = new Wallet(
  "e4f08299e9fe6d3ee52b94b5594117c1fcbb6d8863f54de1ac02a44acda93643",
  "8ad2cec47edd2a95338d3e348d31eb10c44568950ef1406967f8cfeac2d4c289e4f08299e9fe6d3ee52b94b5594117c1fcbb6d8863f54de1ac02a44acda93643"
);
export const WALLET2 = new Wallet(
  "8dff975a91f6b59d36529c424572a9fe24add1075dc2c80a9804313c1afa657a",
  "95c9d42fd486ac32da9025231a3f14f0569c4d25222e44c12d78d03a6f1254ae8dff975a91f6b59d36529c424572a9fe24add1075dc2c80a9804313c1afa657a"
);
export const WALLET3 = new Wallet(
  "241133a76a1688bd550a04e8ea5faa82a16bd8f0e956a988bd7c0e483f8688d5",
  "89f95f84c498a8895a104040371a5442ea9c65d6bbf3f9b3c9d961923b6446bb241133a76a1688bd550a04e8ea5faa82a16bd8f0e956a988bd7c0e483f8688d5"
);

export const DEFAULT_WALLETS = [WALLET1, WALLET2, WALLET3];

export const DEFAULT_UTXOS = {
  "tx1:0": { address: WALLET1.publicKey, amount: 5, locked: false },
  "tx1:1": { address: WALLET1.publicKey, amount: 8, locked: false },
  "tx1:2": { address: WALLET2.publicKey, amount: 4, locked: false },
  "tx2:0": { address: WALLET3.publicKey, amount: 4, locked: false },
};
