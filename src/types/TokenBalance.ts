import * as tzktApi from "@tzkt/sdk-api";
import { FA12Token, FA2Token, NFT, RawTokenInfo, fromRaw as fromRawToken } from "./Token";
import { RawAlias } from "./Address";

type Balance = { balance: string };
export type FA12TokenBalance = FA12Token & Balance;
export type FA2TokenBalance = FA2Token & Balance;
export type NFTBalance = NFT & Balance;
export type TokenBalanceWithToken = FA12TokenBalance | FA2TokenBalance | NFTBalance;
export type TokenBalance = Pick<TokenBalanceWithToken, "contract" | "tokenId" | "balance">;

export type RawTokenBalance = Omit<tzktApi.TokenBalance, "account" | "token"> & {
  account: RawAlias;
  token: RawTokenInfo;
};

export const fromRaw = (raw: RawTokenBalance): TokenBalanceWithToken | null => {
  const token = fromRawToken(raw.token);
  if (!token || !raw.balance) {
    return null;
  }
  return { balance: raw.balance, ...token };
};

export const keepNFTs = (assets: TokenBalanceWithToken[]) => {
  return assets.filter((asset): asset is NFTBalance => asset.type === "nft");
};
export const keepFA1s = (assets: TokenBalanceWithToken[]) => {
  return assets.filter((asset): asset is FA12TokenBalance => asset.type === "fa1.2");
};

export const keepFA2s = (assets: TokenBalanceWithToken[]) => {
  return assets.filter((asset): asset is FA2TokenBalance => asset.type === "fa2");
};
