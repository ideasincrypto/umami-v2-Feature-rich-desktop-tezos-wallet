import { accountsSlice } from "./accountsSlice";
import { makeDefaultDevSignerKeys } from "../../../mocks/devSignerKeys";
import {
  mockImplicitAccount,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { MnemonicAccount } from "../../../types/Account";
import * as cryptoFunctionsToMock from "../../crypto/AES";
import * as mnemonicFunctionsToMock from "../../mnemonic";
import { store } from "../store";

const {
  actions: {
    addMockMnemonicAccounts,
    addAccount,
    removeMnemonicAndAccounts,
    renameAccount,
    addMnemonicAccounts,
  },
} = accountsSlice;

const derivePublicKeyPairMock = jest.spyOn(mnemonicFunctionsToMock, "derivePublicKeyPair");
const decryptMock = jest.spyOn(cryptoFunctionsToMock, "decrypt");

beforeEach(async () => {
  const { pk, pkh } = await makeDefaultDevSignerKeys(0);
  derivePublicKeyPairMock.mockResolvedValue({
    pk,
    pkh,
  });
  decryptMock.mockResolvedValue("unencryptedFingerprint");
});

describe("Accounts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().accounts).toEqual({
      items: [],
      seedPhrases: {},
      secretKeys: {},
    });
  });

  test("should handle adding accounts and arrays of accounts", () => {
    store.dispatch(addMockMnemonicAccounts([mockMnemonicAccount(1)]));
    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(1)],
      seedPhrases: {},
      secretKeys: {},
    });

    store.dispatch(addMockMnemonicAccounts([mockMnemonicAccount(2), mockMnemonicAccount(3)]));
    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)],
      seedPhrases: {},
      secretKeys: {},
    });
  });

  test("adding account should throw and exception if it is a pkh duplicate and not modify state", () => {
    store.dispatch(
      addMockMnemonicAccounts([
        mockMnemonicAccount(1),
        mockMnemonicAccount(2),
        mockMnemonicAccount(3),
      ])
    );

    expect(() => store.dispatch(addMockMnemonicAccounts([mockMnemonicAccount(2)]))).toThrow(
      `Can't add account ${mockImplicitAccount(2).address.pkh} in store since it already exists.`
    );

    expect(store.getState().accounts).toEqual({
      items: [mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)],
      seedPhrases: {},
      secretKeys: {},
    });
  });

  describe("removeMnemonicAndAccounts", () => {
    it("deletes seedphrases and all derived accounts", async () => {
      store.dispatch(
        addMnemonicAccounts({
          seedFingerprint: "mockPrint1",
          accounts: [
            mockImplicitAccount(1, undefined, "mockPrint1") as MnemonicAccount,
            mockImplicitAccount(3, undefined, "mockPrint1") as MnemonicAccount,
          ],
          encryptedMnemonic: {} as any,
        })
      );

      store.dispatch(
        addMnemonicAccounts({
          seedFingerprint: "mockPrint2",
          accounts: [mockImplicitAccount(2, undefined, "mockPrint2") as MnemonicAccount],
          encryptedMnemonic: {} as any,
        })
      );

      expect(store.getState().accounts).toEqual({
        items: [
          mockImplicitAccount(1, undefined, "mockPrint1"),
          mockImplicitAccount(3, undefined, "mockPrint1"),
          mockImplicitAccount(2, undefined, "mockPrint2"),
        ],
        seedPhrases: { mockPrint1: {}, mockPrint2: {} },
        secretKeys: {},
      });

      store.dispatch(removeMnemonicAndAccounts({ fingerPrint: "mockPrint1" }));

      expect(store.getState().accounts).toEqual({
        items: [mockImplicitAccount(2, undefined, "mockPrint2")],
        seedPhrases: { mockPrint2: {} },
        secretKeys: {},
      });
    });
  });

  describe("removeNonMnemonicAccounts", () => {
    const mnemonic = mockMnemonicAccount(0);
    const social1 = mockSocialAccount(1);
    const social2 = mockSocialAccount(2);
    const ledger = mockLedgerAccount(3);
    const secretKey = mockSecretKeyAccount(4);

    beforeEach(() => {
      store.dispatch(addAccount(mnemonic));
      store.dispatch(addAccount(social1));
      store.dispatch(addAccount(social2));
      store.dispatch(addAccount(ledger));
      store.dispatch(addAccount(secretKey));
    });

    it("does nothing for mnemonic account", async () => {
      store.dispatch(
        accountsSlice.actions.removeNonMnemonicAccounts({
          accountType: "mnemonic",
        })
      );
      expect(store.getState().accounts.items).toHaveLength(5);
    });

    it("should remove ledger account", async () => {
      store.dispatch(
        accountsSlice.actions.removeNonMnemonicAccounts({
          accountType: "ledger",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic, social1, social2, secretKey]);
    });

    it("removes the secret key account", async () => {
      store.dispatch(
        accountsSlice.actions.removeNonMnemonicAccounts({
          accountType: "secret_key",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic, social1, social2, ledger]);
    });

    it("should remove multiple social accounts", async () => {
      store.dispatch(
        accountsSlice.actions.removeNonMnemonicAccounts({
          accountType: "social",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic, ledger, secretKey]);
    });
  });

  describe("removeAccount", () => {
    const mnemonic = mockMnemonicAccount(0);
    const social1 = mockSocialAccount(1);
    const social2 = mockSocialAccount(2);
    const ledger = mockLedgerAccount(3);
    const secretKey = mockSecretKeyAccount(4);

    beforeEach(() => {
      store.dispatch(addMockMnemonicAccounts([mnemonic]));
      store.dispatch(addAccount(social1));
      store.dispatch(addAccount(social2));
      store.dispatch(addAccount(ledger));
      store.dispatch(addAccount(secretKey));
    });

    const accounts = [social1, social2, ledger, secretKey];

    it.each(accounts)("removes $type account", account => {
      store.dispatch(accountsSlice.actions.removeAccount(account));

      const remainingAccounts = accounts.filter(acc => acc.address.pkh !== account.address.pkh);
      expect(store.getState().accounts.items).toEqual([mnemonic, ...remainingAccounts]);
    });
  });

  describe("addMnemonicAccounts", () => {
    it("adds mnemonic accounts & encrypted seedphrase to storage", async () => {
      const seedFingerprint = "mockPrint1";
      const mockEncrypted = { mock: "encrypted" };
      const restoredAccounts: MnemonicAccount[] = [
        mockImplicitAccount(1, undefined, "mockPrint1") as MnemonicAccount,
        mockImplicitAccount(3, undefined, "mockPrint1") as MnemonicAccount,
      ];

      store.dispatch(
        addMnemonicAccounts({
          seedFingerprint,
          accounts: restoredAccounts,
          encryptedMnemonic: mockEncrypted as any,
        })
      );

      expect(store.getState().accounts.items).toEqual(restoredAccounts);
      expect(store.getState().accounts.seedPhrases).toEqual({
        [seedFingerprint]: mockEncrypted,
      });
    });
  });

  describe("rename account", () => {
    const [mnemonic1, mnemonic2, social, ledger] = [
      mockMnemonicAccount(1),
      mockMnemonicAccount(2),
      mockSocialAccount(3),
      mockLedgerAccount(4),
    ];

    beforeEach(() => {
      store.dispatch(addMockMnemonicAccounts([mnemonic1, mnemonic2]));
      store.dispatch(addAccount(social));
      store.dispatch(addAccount(ledger));
    });

    it("throws when the new name is empty", () => {
      expect(() => store.dispatch(renameAccount({ account: mnemonic1, newName: "" }))).toThrow(
        "Cannot rename account to an empty name."
      );
    });

    it("throws when the new name is used by other implicit account", () => {
      expect(() =>
        store.dispatch(renameAccount({ account: mnemonic1, newName: social.label }))
      ).toThrow(
        "Cannot rename account tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf to Account 4 since the name already exists."
      );
    });

    it("doesn't do anything for non existing account", () => {
      store.dispatch(
        renameAccount({
          account: { ...mnemonic1, label: "non existing account" },
          newName: "new name",
        })
      );
      expect(store.getState().accounts.items).toEqual([mnemonic1, mnemonic2, social, ledger]);
    });

    it("renames mnemonic account", () => {
      store.dispatch(renameAccount({ account: mnemonic2, newName: "new mnemonic2 label" }));
      expect(
        store.getState().accounts.items.find(account => account.label === mnemonic2.label)
      ).toBeUndefined();
      expect(
        store.getState().accounts.items.find(account => account.label === "new mnemonic2 label")
      ).toEqual({ ...mnemonic2, label: "new mnemonic2 label" });
    });

    it("renames social account", () => {
      store.dispatch(renameAccount({ account: social, newName: "new social label" }));
      expect(
        store.getState().accounts.items.find(account => account.label === social.label)
      ).toBeUndefined();
      expect(
        store.getState().accounts.items.find(account => account.label === "new social label")
      ).toEqual({ ...social, label: "new social label" });
    });

    it("renames ledger account", () => {
      store.dispatch(renameAccount({ account: ledger, newName: "new ledger label" }));
      expect(
        store.getState().accounts.items.find(account => account.label === ledger.label)
      ).toBeUndefined();
      expect(
        store.getState().accounts.items.find(account => account.label === "new ledger label")
      ).toEqual({ ...ledger, label: "new ledger label" });
    });
  });
});
