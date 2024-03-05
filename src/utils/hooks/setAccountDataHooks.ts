import { useDispatch } from "react-redux";

import {
  useGetNextAvailableAccountLabels,
  useImplicitAccounts,
  useSeedPhrases,
} from "./getAccountDataHooks";
import { useSelectedNetwork } from "./networkHooks";
import { AccountType, LedgerAccount, MnemonicAccount, SocialAccount } from "../../types/Account";
import { makeDerivationPath } from "../account/derivationPathUtils";
import { makeMnemonicAccount } from "../account/makeMnemonicAccount";
import { decrypt, encrypt } from "../crypto/AES";
import { useRestoreRevealedMnemonicAccounts } from "../mnemonic";
import { useAppDispatch } from "../redux/hooks";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { restore as restoreFromSecretKey } from "../redux/thunks/secretKeyAccount";
import { derivePublicKeyPair, getFingerPrint } from "../tezos";

const { addAccount, removeMnemonicAndAccounts, removeNonMnemonicAccounts } = accountsSlice.actions;

export const useReset = () => {
  return () => {
    localStorage.clear();

    window.location.reload();
  };
};

/**
 * Restores accounts from a mnemonic group when it's being added by an existing seedphrase.
 *
 * Creates some revealed mnemonic accounts matching given {@link derivationPath},
 * or, if no accounts were revealed, an account with the smallest derivation path (accountIndex = 0).
 * Check {@link useRestoreRevealedMnemonicAccounts} for logic of restoring revealed accounts.
 *
 * Restored accounts and their encrypted mnemonic are added to the {@link accountsSlice}.
 *
 * @param mnemonic - Space separated words making a BIP39 seed phrase.
 * @param password - User's password, used for encrypting mnemonic.
 * @param derivationPathPattern - Path pattern for the account group that's being added.
 * @param label - Account group prefix.
 */
export const useRestoreFromMnemonic = () => {
  const network = useSelectedNetwork();
  const restoreRevealedMnemonicAccounts = useRestoreRevealedMnemonicAccounts();
  const dispatch = useDispatch();
  return async ({
    mnemonic,
    password,
    derivationPath,
    label,
  }: {
    mnemonic: string;
    password: string;
    derivationPath: string;
    label: string;
  }) => {
    const seedFingerprint = await getFingerPrint(mnemonic);
    const accounts = await restoreRevealedMnemonicAccounts(
      mnemonic,
      network,
      derivationPath,
      label
    );
    const encryptedMnemonic = await encrypt(mnemonic, password);

    dispatch(
      accountsSlice.actions.addMnemonicAccounts({
        seedFingerprint,
        accounts,
        encryptedMnemonic,
      })
    );
  };
};

/**
 * Adds account to a mnemonic group.
 *
 * The account is not guaranteed to not been used before.
 * It could have been revealed (and used) in the past, but skipped after deleting a group and restoring it after.
 *
 * New account is added to the {@link accountsSlice}.
 *
 * @param fingerPrint - Hash of the mnemonic. Generated with {@link getFingerPrint}. We use it to group together accounts derived from the same mnemonic
 * @param password - User's password, used for decrypting the mnemonic.
 * @param label - Account name prefix, used to create a unique account name.
 */
export const useDeriveMnemonicAccount = () => {
  const encryptedMnemonics = useSeedPhrases();
  const implicitAccounts = useImplicitAccounts();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const dispatch = useDispatch();

  return async ({
    fingerPrint,
    password,
    label,
  }: {
    fingerPrint: string;
    password: string;
    label: string;
  }) => {
    const encryptedSeedphrase = encryptedMnemonics[fingerPrint];
    if (!encryptedSeedphrase) {
      throw new Error(`No seedphrase found with fingerprint: ${fingerPrint}`);
    }
    const seedphrase = await decrypt(encryptedSeedphrase, password);

    const existingGroupAccounts = implicitAccounts.filter(
      (acc): acc is MnemonicAccount =>
        acc.type === "mnemonic" && acc.seedFingerPrint === fingerPrint
    );
    // We can only delete the whole group, so skipped indexes are not possible.
    const nextIndex = existingGroupAccounts.length;

    // Newly derived accounts use a derivation path in the same pattern as the first account
    const pattern = existingGroupAccounts[0].derivationPathPattern;

    const nextDerivationPath = makeDerivationPath(pattern, nextIndex);
    const { pk, pkh } = await derivePublicKeyPair(seedphrase, nextDerivationPath);

    const uniqueLabel = getNextAvailableAccountLabels(label, 1)[0];
    const account = makeMnemonicAccount(
      pk,
      pkh,
      nextDerivationPath,
      pattern,
      fingerPrint,
      uniqueLabel
    );

    dispatch(accountsSlice.actions.addAccount(account));
  };
};

export const useRestoreFromSecretKey = () => {
  const dispatch = useAppDispatch();

  return (secretKey: string, password: string, label: string) =>
    dispatch(
      restoreFromSecretKey({
        secretKey,
        password,
        label,
      })
    );
};

export const useRestoreLedger = () => {
  const dispatch = useAppDispatch();
  return (derivationPath: string, pk: string, pkh: string, label: string) => {
    const account: LedgerAccount = {
      derivationPath,
      curve: "ed25519",
      type: "ledger",
      pk: pk,
      address: { type: "implicit", pkh },
      label,
    };
    dispatch(addAccount(account));
  };
};

export const useRestoreSocial = () => {
  const dispatch = useAppDispatch();
  return (pk: string, pkh: string, label: string) => {
    const account: SocialAccount = {
      type: "social",
      pk: pk,
      address: { type: "implicit", pkh },
      idp: "google",
      label,
    };
    dispatch(addAccount(account));
  };
};

export const useRemoveMnemonic = () => {
  const dispatch = useAppDispatch();
  return (fingerPrint: string) => {
    dispatch(
      removeMnemonicAndAccounts({
        fingerPrint,
      })
    );
  };
};

export const useRemoveNonMnemonic = () => {
  const dispatch = useAppDispatch();
  return (accountType: AccountType) => {
    dispatch(
      removeNonMnemonicAccounts({
        accountType,
      })
    );
  };
};
