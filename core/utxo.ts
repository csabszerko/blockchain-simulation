export type UTXO = {
  address: string;
  amount: number;
  reserved: boolean;
};

export type UTXOSet = Record<string, UTXO>;
