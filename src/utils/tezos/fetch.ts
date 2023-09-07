import {
  blocksGetCount,
  Delegate,
  DelegationOperation,
  operationsGetDelegations,
  operationsGetTransactions,
  tokensGetTokenTransfers,
  delegatesGet,
  TokenTransfer,
} from "@tzkt/sdk-api";
import axios from "axios";
import { coincapUrl } from "./consts";
import { coinCapResponseType } from "./types";
import { TezTransfer } from "../../types/Transfer";
import { RawTokenBalance } from "../../types/TokenBalance";
import { Network } from "../../types/Network";

// TzKT defines type Account = {type: string};
// whilst accountsGet returns all the info about accounts
// for now we need only the balance, but we can extend it later
export type TzktAccount = { address: string; balance: number };

export const getAccounts = async (pkhs: string[], network: Network): Promise<TzktAccount[]> => {
  const response = await axios.get<TzktAccount[]>(
    `${network.tzktApiUrl}/v1/accounts?address.in=${pkhs.join(",")}&select=address,balance`
  );
  return response.data;
};

export const getTokenBalances = async (
  pkhs: string[],
  network: Network
): Promise<RawTokenBalance[]> => {
  const response = await axios.get<RawTokenBalance[]>(
    `${network.tzktApiUrl}/v1/tokens/balances?account.in=${pkhs.join(",")}&balance.gt=0`
  );
  return response.data;
};

export const getTezTransfers = (address: string, network: Network): Promise<TezTransfer[]> => {
  return operationsGetTransactions(
    {
      anyof: { fields: ["sender", "target"], eq: address },
      sort: { desc: "level" },
      limit: 10,
    },
    {
      baseUrl: network.tzktApiUrl,
    }
  );
};

export const getTokenTransfers = (address: string, network: Network): Promise<TokenTransfer[]> => {
  return tokensGetTokenTransfers(
    {
      anyof: { fields: ["from", "to"], eq: address },
      sort: { desc: "level" },
      limit: 10,
    },
    {
      baseUrl: network.tzktApiUrl,
    }
  );
};

export const getLastDelegation = async (
  address: string,
  network: Network
): Promise<DelegationOperation | undefined> => {
  return operationsGetDelegations(
    {
      sender: { eq: address },
      sort: { desc: "level" },
      limit: 1,
    },
    {
      baseUrl: network.tzktApiUrl,
    }
  ).then(d => d[0]);
};

// Fetch the tezos price in usd from the CoinCap API.
// The CoinCap API documentation: https://docs.coincap.io
export const getTezosPriceInUSD = async (): Promise<number | null> => {
  const {
    data: {
      data: { priceUsd },
    },
  } = await axios.get<coinCapResponseType>(`${coincapUrl}/tezos`);

  return priceUsd ?? null;
};

export const getLatestBlockLevel = async (network: Network): Promise<number> => {
  return await blocksGetCount({
    baseUrl: network.tzktApiUrl,
  });
};

export const getBakers = async (network: Network): Promise<Delegate[]> => {
  return delegatesGet(
    {
      sort: { desc: "stakingBalance" },
      active: { eq: true },
      limit: 10000,
      select: { fields: ["address,alias,stakingBalance"] },
    },
    {
      baseUrl: network.tzktApiUrl,
    }
  );
};
