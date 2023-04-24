import { seedPhrase } from "../mocks/seedPhrase";
import { Account, AccountType } from "../types/Account";
import {
  getDerivationPath,
  restoreAccounts,
  restoreMnemonicAccounts,
} from "./restoreAccounts";
import { addressExists, getFingerPrint } from "./tezos";

import "../mocks/mockGetRandomValues";
jest.mock("./tezos");

const addressExistsMock = addressExists as jest.Mock;
const getFingerPrintMock = getFingerPrint as jest.Mock;

beforeEach(() => {
  getFingerPrintMock.mockResolvedValue("mockFingerPrint");
});

describe("restoreAccounts", () => {
  it("should restore exising accounts", async () => {
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreAccounts(seedPhrase);
    const expected = [
      {
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        sk: "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA",
      },
      {
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        sk: "edskRtep9NUmE7JZZdHtB7fxFzvvWRY866eS4DrChgYZrAZZoqCiw8DhGQnhncLxpxucVKBxJML8fUUoAcfjinYNUFnU8NJV8p",
      },
      {
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sk: "edskS9RvEPRrob1SdcWPb66Cp9sRFoYHkVRqsJ8ChVcKfpLpmTUXhM8AA2SGf4tJrVYV6UW1TdBz4NrWrVGHz672iTSUpaVbg7",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should restore first account if none exists", async () => {
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreAccounts(seedPhrase);
    const expected = [
      {
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        sk: "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA",
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
    const result = await restoreMnemonicAccounts(seedPhrase);
    const expected: Account[] = [
      {
        curve: "ed25519",
        derivationPath: getDerivationPath(0),
        type: AccountType.MNEMONIC,
        pk: "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6HG",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        seedFingerPrint: "mockFingerPrint",
        label: "Account 0",
      },
      {
        curve: "ed25519",
        derivationPath: getDerivationPath(1),
        type: AccountType.MNEMONIC,
        pk: "edpkuDBhPULoNAoQbjDUo6pYdpY5o3DugXo1GAJVQGzGMGFyKUVcKN",
        pkh: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        seedFingerPrint: "mockFingerPrint",
        label: "Account 1",
      },
      {
        curve: "ed25519",
        derivationPath: getDerivationPath(2),
        type: AccountType.MNEMONIC,
        pk: "edpktzYEtcJypEEhzZva7QPc8QcvBuKAsXSmTpR1wFPna3xWB48QDy",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        seedFingerPrint: "mockFingerPrint",
        label: "Account 2",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("should restore exising accounts with a provided label", async () => {
    const CUSTOM_LABEL = "myLabel";
    addressExistsMock.mockResolvedValueOnce(false);
    const result = await restoreMnemonicAccounts(seedPhrase, CUSTOM_LABEL);
    const expected: Account[] = [
      expect.objectContaining({
        label: CUSTOM_LABEL,
      }),
    ];
    expect(result).toEqual(expected);

    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(true);
    addressExistsMock.mockResolvedValueOnce(false);
    const result2 = await restoreMnemonicAccounts(seedPhrase, CUSTOM_LABEL);
    const expected2: Account[] = [
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 0`,
      }),
      expect.objectContaining({
        label: `${CUSTOM_LABEL} 1`,
      }),
    ];
    expect(result2).toEqual(expected2);
  });
});