import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxList,
  ComboboxGroup,
  ComboboxItem,
} from "../../ui/combobox/index.js";
import type Wallet from "core/wallet.js";

export default function WalletSelectorComboBox({
  wallets,
  value,
  setValue,
}: {
  wallets: Wallet[];
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <Combobox
      data={wallets.map((wallet) => ({
        value: wallet.publicKey,
        label: wallet.publicKey,
      }))}
      type="wallet"
      value={value}
      onValueChange={setValue}
    >
      <ComboboxTrigger className="w-full truncate" />
      <ComboboxContent className="w-full">
        <ComboboxInput />
        <ComboboxList>
          <ComboboxGroup>
            {wallets.map((wallet) => (
              <ComboboxItem key={wallet.publicKey} value={wallet.publicKey}>
                <div className="truncate">{wallet.publicKey}</div>
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
