import { mnemonic1 } from "../mocks/mockMnemonic";
import { ImplicitAccount, AccountType } from "../types/Account";
import { restoreRevealedMnemonicAccounts, restoreRevealedPublickKeyPairs } from "./mnemonic";
import { addressExists, getFingerPrint } from "./tezos";

import {
  defaultDerivationPathPattern,
  getDefaultDerivationPath,
} from "./account/derivationPathUtils";

const addressExistsMock = jest.mocked(addressExists);
const getFingerPrintMock = jest.mocked(getFingerPrint);

beforeEach(() => {
  getFingerPrintMock.mockResolvedValue("mockFingerPrint");
});

describe("restoreAccounts", () => {
  it("should restore exising accounts", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreRevealedPublickKeyPairs(mnemonic1, defaultDerivationPathPattern);
    const expected = [
      {
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      {
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
      },
      {
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should restore first account if none exists", async () => {
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreRevealedPublickKeyPairs(mnemonic1, defaultDerivationPathPattern);
    const expected = [
      {
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
    ];

    expect(result).toEqual(expected);
  });
});

describe("restoreEncryptedAccounts", () => {
  it("should restore exising accounts with a default curve and label", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreRevealedMnemonicAccounts(mnemonic1);
    const expected: ImplicitAccount[] = [
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(0),
        type: AccountType.MNEMONIC,
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        address: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        seedFingerPrint: "mockFingerPrint",
        label: "Account 0",
        derivationPathPattern: "44'/1729'/?'/0'",
      },
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(1),
        type: AccountType.MNEMONIC,
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        address: { type: "implicit", pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6" },
        seedFingerPrint: "mockFingerPrint",
        label: "Account 1",
        derivationPathPattern: "44'/1729'/?'/0'",
      },
      {
        curve: "ed25519",
        derivationPath: getDefaultDerivationPath(2),
        type: AccountType.MNEMONIC,
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        address: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        seedFingerPrint: "mockFingerPrint",
        label: "Account 2",
        derivationPathPattern: "44'/1729'/?'/0'",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should restore exising accounts with a provided label", async () => {
    const CUSTOM_LABEL = "myLabel";
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreRevealedMnemonicAccounts(mnemonic1, CUSTOM_LABEL);
    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: CUSTOM_LABEL,
      }),
    ];
    expect(result).toEqual(expected);

    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result2 = await restoreRevealedMnemonicAccounts(mnemonic1, CUSTOM_LABEL);
    const expected2: ImplicitAccount[] = [
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 0`,
      }),
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 1`,
      }),
    ];
    expect(result2).toEqual(expected2);
  });

  it("should restore existing accounts with a custom derivation path", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreRevealedMnemonicAccounts(mnemonic1, undefined, "44'/1729'/?'/0'");

    const expected: ImplicitAccount[] = [
      expect.objectContaining({
        label: `Account 0`,
        derivationPath: "44'/1729'/0'/0'",
      }),
      expect.objectContaining({
        label: `Account 1`,
        derivationPath: "44'/1729'/1'/0'",
      }),
    ];
    expect(result).toEqual(expected);
  });

  it("should throw if provided with an invalid derivation pattern", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = restoreRevealedMnemonicAccounts(mnemonic1, undefined, "44'/foo'/?'/8'");

    await expect(result).rejects.toThrowError("Invalid derivation pattern: 44'/foo'/?'/8'");
  });
});