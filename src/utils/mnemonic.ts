import { generateMnemonic } from "bip39";

import { makeDerivationPath } from "./account/derivationPathUtils";
import { makeMnemonicAccount } from "./account/makeMnemonicAccount";
import { useGetNextAvailableAccountLabels } from "./hooks/labelsHooks";
import { PublicKeyPair, addressExists, derivePublicKeyPair, getFingerPrint } from "./tezos";
import { MnemonicAccount } from "../types/Account";
import { Network } from "../types/Network";

// This is put in a separate file for mocking purposes in tests
export const generate24WordMnemonic = () => generateMnemonic(256);

/**
 * Finds revealed public key pairs matching the given {@link derivationPathTemplate}.
 *
 * Checks matching public key pairs starting from index = 0.
 * If a key pair was revealed, it will be added to response and the next index will be checked.
 *
 * Once an index for unrevealed key pair is found, the process stops,
 * even though there might be more revealed accounts with bigger indexes.
 *
 * At least one {@link PublicKeyPair} will be added in any case.
 * If no accounts were revealed, account with the smallest derivation path (index = 0) will be added.
 *
 * @param mnemonic - Space separated words making a BIP39 seed phrase.
 * @param derivationPathTemplate - Path pattern for searching for the key pairs.
 * @returns List of revealed {@link PublicKeyPair} associated with the given parameters.
 */
export const restoreRevealedPublicKeyPairs = async (
  mnemonic: string,
  derivationPathTemplate: string,
  network: Network
): Promise<PublicKeyPair[]> => {
  const result: PublicKeyPair[] = [];
  let accountIndex = 0;
  let pubKeyPair = await derivePublicKeyPair(
    mnemonic,
    makeDerivationPath(derivationPathTemplate, accountIndex)
  );
  do {
    result.push(pubKeyPair);
    accountIndex += 1;
    pubKeyPair = await derivePublicKeyPair(
      mnemonic,
      makeDerivationPath(derivationPathTemplate, accountIndex)
    );
  } while (await addressExists(pubKeyPair.pkh, network));
  return result;
};

/**
 * Restores accounts from a mnemonic group when it's being added by an existing seedphrase.
 *
 * Creates some revealed mnemonic accounts matching given {@link derivationPathTemplate},
 * or, if no accounts were revealed, an account with the smallest derivation path (accountIndex = 0).
 *
 * Check {@link restoreRevealedPublicKeyPairs} for logic of restoring revealed accounts.
 *
 * @param mnemonic - Space separated words making a BIP39 seed phrase.
 * @param network - Stores Tezos network & tzkt indexer settings.
 * @param derivationPathTemplate - Path pattern for the account group that's being added.
 * @param label - Account group prefix.
 * @returns A list of revealed mnemonic accounts that will be added.
 */
export const useRestoreRevealedMnemonicAccounts = () => {
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  return async (
    mnemonic: string,
    network: Network,
    derivationPathTemplate: string,
    label: string
  ): Promise<MnemonicAccount[]> => {
    const pubKeyPairs = await restoreRevealedPublicKeyPairs(
      mnemonic,
      derivationPathTemplate,
      network
    );
    const seedFingerPrint = await getFingerPrint(mnemonic);
    const accountLabels = getNextAvailableAccountLabels(label, pubKeyPairs.length);

    return pubKeyPairs.map(({ pk, pkh }, accountIndex) =>
      makeMnemonicAccount(
        pk,
        pkh,
        makeDerivationPath(derivationPathTemplate, accountIndex),
        derivationPathTemplate,
        seedFingerPrint,
        accountLabels[accountIndex]
      )
    );
  };
};
