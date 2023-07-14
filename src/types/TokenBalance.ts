import * as tzktApi from "@tzkt/sdk-api";
import { BigNumber } from "bignumber.js";
import { Metadata, RawTokenInfo, Token, fromRaw as fromRawToken } from "./Token";
import { getIPFSurl } from "../utils/token/nftUtils";
import { TezosNetwork } from "@airgap/tezos";

export type TokenBalance = Token & { balance: string };

export type RawTokenBalance = Omit<tzktApi.TokenBalance, "token"> & { token: RawTokenInfo };

export const fromRaw = (raw: RawTokenBalance): TokenBalance | null => {
  const token = fromRawToken(raw.token);
  if (!token || !raw.balance) {
    return null;
  }
  return { balance: raw.balance, ...token };
};

const defaultTokenName = (asset: TokenBalance): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_NAME;
    case "fa2":
      return DEFAULT_FA2_NAME;
    case "nft":
      return DEFAULT_NFT_NAME;
  }
};

export const tokenName = (asset: TokenBalance): string => {
  return asset.metadata?.name || defaultTokenName(asset);
};

const defaultTokenSymbol = (asset: TokenBalance): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_SYMBOL;
    case "fa2":
      return DEFAULT_FA2_SYMBOL;
    case "nft":
      return DEFAULT_NFT_SYMBOL;
  }
};

export const tokenSymbol = (asset: TokenBalance): string => {
  return asset.metadata?.symbol || defaultTokenSymbol(asset);
};

export const tokenDecimal = (asset: TokenBalance): string => {
  return asset.metadata?.decimals === undefined ? DEFAULT_TOKEN_DECIMALS : asset.metadata.decimals;
};

export const httpIconUri = (asset: FA12TokenBalance | FA2TokenBalance): string | undefined => {
  let iconUri;
  if (asset.type === "fa1.2") {
    iconUri = asset.metadata?.icon;
  } else if (asset.type === "fa2") {
    iconUri = asset.metadata?.thumbnailUri;
  }
  return iconUri && getIPFSurl(iconUri);
};

export const getRealAmount = (asset: TokenBalance, prettyAmount: string): BigNumber => {
  const amount = new BigNumber(prettyAmount);

  if (asset.type === "nft") {
    return amount;
  }

  const decimals = tokenDecimal(asset);

  return amount.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));
};

export type FA12TokenBalance = {
  type: "fa1.2";
  contract: string;
  balance: string;
  metadata?: Metadata;
};

export type FA2TokenBalance = {
  type: "fa2";
  metadata?: Metadata;
  contract: string;
  tokenId: string;
  balance: string;
};

export type NFTBalance = {
  id: number; // TODO: replace with contract + tokenId
  type: "nft";
  contract: string;
  tokenId: string;
  balance: string;
  metadata: Metadata;
  displayUri: string;
  totalSupply: string | undefined;
};

export const keepNFTs = (assets: TokenBalance[]) => {
  return assets.filter((asset): asset is NFTBalance => asset.type === "nft");
};
export const keepFA1s = (assets: TokenBalance[]) => {
  return assets.filter((asset): asset is FA12TokenBalance => asset.type === "fa1.2");
};

export const keepFA2s = (assets: TokenBalance[]) => {
  return assets.filter((asset): asset is FA2TokenBalance => asset.type === "fa2");
};

export const formatTokenAmount = (amountStr: string, decimals = DEFAULT_TOKEN_DECIMALS) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

export const tokenPrettyBalance = (
  token: FA2TokenBalance | FA12TokenBalance,
  options?: { showSymbol?: boolean }
) => {
  const symbol = tokenSymbol(token);
  const amount = token.balance;
  const decimals = token.metadata?.decimals;
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  const result = formatTokenAmount(amount, decimals);

  return `${result}${trailingSymbol}`;
};

export const artifactUri = (nft: NFTBalance): string => {
  return nft.metadata.artifactUri || nft.displayUri;
};

export const thumbnailUri = (nft: NFTBalance): string => {
  return nft.metadata.thumbnailUri || nft.displayUri;
};

export const mimeType = (nft: NFTBalance) => {
  return nft.metadata.formats?.find(format => format.uri === artifactUri(nft))?.mimeType;
};

export const royalties = (nft: NFTBalance): Array<{ address: string; share: number }> => {
  const royalties = nft.metadata.royalties;
  if (!royalties) {
    return [];
  }

  const totalShares = Math.pow(10, Number(royalties.decimals));
  const shares = Object.entries(royalties.shares).map(([address, share]) => {
    return { address: address, share: (Number(share) * 100) / totalShares };
  });
  shares.sort((a, b) => (a.share < b.share ? 1 : -1));
  return shares;
};

export const metadataUri = (nft: NFTBalance, network: TezosNetwork) => {
  return `https://${network}.tzkt.io/${nft.contract}/tokens/${nft.tokenId}/metadata`;
};

// We use the defaults for FA1.2 tokens as in V1
export const DEFAULT_FA1_NAME = "FA1.2 token";
export const DEFAULT_FA2_NAME = "FA2 token";
export const DEFAULT_NFT_NAME = "NFT";
export const DEFAULT_FA1_SYMBOL = "FA1.2";
export const DEFAULT_FA2_SYMBOL = "FA2";
export const DEFAULT_NFT_SYMBOL = "NFT";
export const DEFAULT_TOKEN_DECIMALS = "4";