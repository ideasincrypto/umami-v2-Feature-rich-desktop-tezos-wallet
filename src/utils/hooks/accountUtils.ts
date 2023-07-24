import BigNumber from "bignumber.js";
import { compact } from "lodash";
import { MnemonicAccount } from "../../types/Account";
import { decrypt } from "../aes";
import { deriveSkFromMnemonic } from "../restoreAccounts";
import { useAppSelector } from "../redux/hooks";

export const getTotalTezBalance = (
  balances: Record<string, string | undefined>
): BigNumber | null => {
  const filtered = compact(Object.values(balances));

  if (filtered.length === 0) {
    return null;
  }

  return filtered.reduce((acc, curr) => acc.plus(curr), new BigNumber(0));
};

export const useGetSecretKey = () => {
  const seedPhrases = useAppSelector(s => s.accounts.seedPhrases);
  return async (account: MnemonicAccount, password: string) => {
    const encryptedMnemonic = seedPhrases[account.seedFingerPrint];
    if (!encryptedMnemonic) {
      throw new Error(`Missing seedphrase for account ${account.address.pkh}`);
    }

    try {
      const mnemonic = await decrypt(encryptedMnemonic, password);
      return deriveSkFromMnemonic(mnemonic, account.derivationPath, account.curve);
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error("Failed to decrypt with the provided password");
    }
  };
};
