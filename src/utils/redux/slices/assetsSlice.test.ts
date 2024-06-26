import { accountsSlice } from "./accountsSlice/accountsSlice";
import { assetsSlice } from "./assetsSlice";
import { hedgehoge, tzBtsc } from "../../../mocks/fa12Tokens";
import { mockImplicitAddress, mockTokenTransaction } from "../../../mocks/factories";
import { store } from "../store";

const {
  actions: { removeAccountsData, updateTezBalance, updateTokenBalance, updateTokenTransfers },
} = assetsSlice;

describe("assetsSlice", () => {
  it("is initialized with empty state", () => {
    expect(store.getState().assets).toEqual({
      balances: {
        mutez: {},
        tokens: {},
      },
      transfers: { tokens: {} },
      delegationLevels: {},
      conversionRate: undefined,
      bakers: [],
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  it("resets state on reset", () => {
    store.dispatch(
      updateTezBalance([
        { address: "bar", balance: 44 },
        { address: "baz", balance: 55 },
      ])
    );
    store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

    store.dispatch(accountsSlice.actions.reset());

    expect(store.getState().assets).toEqual({
      balances: { mutez: {}, tokens: {} },
      transfers: { tokens: {} },
      delegationLevels: {},
      bakers: [],
      conversionRate: undefined,
      blockLevel: null,
      refetchTrigger: 0,
      lastTimeUpdated: null,
      isLoading: false,
    });
  });

  describe("updateTezBalance", () => {
    it("replaces tez balances", () => {
      store.dispatch(updateTezBalance([{ address: "foo", balance: 43 }]));

      expect(store.getState().assets).toEqual({
        balances: {
          mutez: {
            foo: "43",
          },
          tokens: {},
        },
        transfers: { tokens: {} },
        delegationLevels: {},
        conversionRate: undefined,
        bakers: [],
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });

      store.dispatch(
        updateTezBalance([
          { address: "bar", balance: 44 },
          { address: "baz", balance: 55 },
        ])
      );

      expect(store.getState().assets).toEqual({
        balances: {
          mutez: {
            bar: "44",
            baz: "55",
          },
          tokens: {},
        },
        transfers: { tokens: {} },
        delegationLevels: {},
        conversionRate: undefined,
        bakers: [],
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });

    it("updates tez balances", () => {
      store.dispatch(
        updateTezBalance([
          { address: "bar", balance: 44 },
          { address: "baz", balance: 55 },
        ])
      );

      store.dispatch(
        updateTezBalance([
          {
            address: "baz",
            balance: 66,
          },
        ])
      );

      expect(store.getState().assets).toEqual({
        balances: {
          mutez: { baz: "66" },
          tokens: {},
        },
        conversionRate: undefined,
        delegationLevels: {},
        bakers: [],
        transfers: { tokens: {} },
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });

    it("sets up delegation levels", () => {
      store.dispatch(
        updateTezBalance([
          { address: "bar", balance: 44, delegationLevel: 5 },
          { address: "baz", balance: 55 },
        ])
      );

      expect(store.getState().assets.delegationLevels).toEqual({
        bar: 5,
      });
    });
  });

  describe("updateTokenBalance", () => {
    it("sets up token balances", () => {
      store.dispatch(updateTokenBalance([hedgehoge(mockImplicitAddress(0))]));

      expect(store.getState().assets).toEqual({
        balances: {
          mutez: {},
          tokens: {
            [mockImplicitAddress(0).pkh]: [
              {
                balance: "10000000000",
                contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
                tokenId: "0",
                lastLevel: 1477579,
              },
            ],
          },
        },
        conversionRate: undefined,
        delegationLevels: {},
        bakers: [],
        transfers: { tokens: {} },
        blockLevel: null,
        refetchTrigger: 0,
        lastTimeUpdated: null,
        isLoading: false,
      });
    });
  });

  describe("updateTokenTransfer", () => {
    it("sets up token transfers on token transfer update", () => {
      store.dispatch(updateTokenTransfers([mockTokenTransaction(1), mockTokenTransaction(2)]));

      expect(store.getState().assets.transfers.tokens).toEqual({
        101: mockTokenTransaction(1),
        102: mockTokenTransaction(2),
      });

      store.dispatch(updateTokenTransfers([mockTokenTransaction(4)]));

      expect(store.getState().assets.transfers.tokens).toEqual({
        101: mockTokenTransaction(1),
        102: mockTokenTransaction(2),
        104: mockTokenTransaction(4),
      });
    });
  });

  describe("removeAccountsData", () => {
    it("removes tez balance for listed accounts", () => {
      store.dispatch(
        updateTezBalance([
          { address: "foo", balance: 11 },
          { address: "bar", balance: 22 },
          { address: "baz", balance: 33 },
        ])
      );

      store.dispatch(removeAccountsData(["bar", "baz", "qwerty"]));

      expect(store.getState().assets.balances.mutez).toEqual({
        foo: "11",
      });
    });

    it("removes token balance for listed accounts", () => {
      store.dispatch(
        updateTokenBalance([tzBtsc(mockImplicitAddress(0)), hedgehoge(mockImplicitAddress(1))])
      );

      store.dispatch(removeAccountsData([mockImplicitAddress(0).pkh, mockImplicitAddress(2).pkh]));

      expect(store.getState().assets.balances.tokens).toEqual({
        [mockImplicitAddress(1).pkh]: [
          {
            balance: "10000000000",
            contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
            tokenId: "0",
            lastLevel: 1477579,
          },
        ],
      });
    });

    it("removes delegation level for listed accounts", () => {
      store.dispatch(
        updateTezBalance([
          { address: "foo", balance: 11, delegationLevel: 1 },
          { address: "bar", balance: 22, delegationLevel: 2 },
          { address: "baz", balance: 33, delegationLevel: 3 },
        ])
      );

      store.dispatch(removeAccountsData(["bar", "baz", "qwerty"]));

      expect(store.getState().assets.delegationLevels).toEqual({
        foo: 1,
      });
    });
  });
});
