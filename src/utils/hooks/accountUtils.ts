import BigNumber from "bignumber.js";
import { MnemonicAccount } from "../../types/Account";
import { decrypt } from "../aes";
import { deriveSkFromMnemonic } from "../restoreAccounts";
import { useAppSelector } from "../store/hooks";

export const getTotalBalance = (balances: Record<string, BigNumber | null>) => {
  const totalTez = Object.values(balances).reduce((acc, curr) => {
    if (acc === null) {
      return curr;
    } else {
      return curr === null ? acc : BigNumber.sum(curr, acc);
    }
  }, null);

  return totalTez;
};

export const useGetSk = () => {
  const seedPhrases = useAppSelector((s) => s.accounts.seedPhrases);
  return async (a: MnemonicAccount, password: string) => {
    const encryptedMnemonic = seedPhrases[a.seedFingerPrint];
    if (!encryptedMnemonic) {
      throw new Error(`Missing seedphrase for account ${a.pkh}`);
    }

    const mnemonic = await decrypt(encryptedMnemonic, password);
    return deriveSkFromMnemonic(mnemonic, a.derivationPath, a.curve);
  };
};