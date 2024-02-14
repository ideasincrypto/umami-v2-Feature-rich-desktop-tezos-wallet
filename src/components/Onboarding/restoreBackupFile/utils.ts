import { decrypt } from "../../../utils/crypto/AES";
import { EncryptedData } from "../../../utils/crypto/types";
import { useRestoreFromMnemonic } from "../../../utils/hooks/setAccountDataHooks";
import { persistor } from "../../../utils/redux/persistor";
import { DEFAULT_ACCOUNT_LABEL } from "../nameAccount/NameAccount";

export const useRestoreV1BackupFile = () => {
  const restoreFromMnemonic = useRestoreFromMnemonic();
  return async (
    backup: { recoveryPhrases: [EncryptedData]; derivationPaths: [string] },
    password: string
  ) => {
    const encrypted: [EncryptedData] = backup["recoveryPhrases"];
    // The prefix `m/` from V1 can be ignored.
    const derivationPaths = backup.derivationPaths.map((path: string) =>
      path.slice(0, 2) === "m/" ? path.slice(2) : path
    );

    const mnemonics = [];

    try {
      for (const encryptedMnemonic of encrypted) {
        mnemonics.push(await decrypt(encryptedMnemonic, password, "V1"));
      }
    } catch (e) {
      throw new Error("Invalid password.");
    }

    for (const [i, mnemonic] of mnemonics.entries()) {
      await restoreFromMnemonic({
        mnemonic,
        password,
        label: DEFAULT_ACCOUNT_LABEL,
        derivationPath: derivationPaths[i],
      });
    }
  };
};

export const restoreV2BackupFile = async (
  backup: { "persist:accounts": string; "persist:root": string },
  password: string
) => {
  const accountsInString: string = backup["persist:accounts"];
  if (!accountsInString) {
    throw new Error("Invalid backup file.");
  }

  const accounts: { seedPhrases: string } = JSON.parse(accountsInString);
  const encryptedMnemonics: Record<string, EncryptedData> = JSON.parse(accounts.seedPhrases);

  try {
    for (const encrypted of Object.values(encryptedMnemonics)) {
      await decrypt(encrypted, password, "V2");
    }
  } catch (e) {
    throw new Error("Invalid password.");
  }

  persistor.pause();

  localStorage.clear();
  localStorage.setItem("persist:accounts", accountsInString);
  localStorage.setItem("persist:root", backup["persist:root"]);
};
