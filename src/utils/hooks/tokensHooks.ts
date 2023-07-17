import { TezosNetwork } from "@airgap/tezos";
import { get } from "lodash";
import { RawPkh } from "../../types/Address";
import { Token } from "../../types/Token";
import { useAppSelector } from "../store/hooks";

export const useGetToken = (network: TezosNetwork) => {
  const tokens = useAppSelector(s => s.tokens[network]);
  return (contract: RawPkh, tokenId: string): Token | undefined => get(tokens, [contract, tokenId]);
};

export const useGetTokenType = (network: TezosNetwork) => {
  const tokens = useAppSelector(s => s.tokens[network]);
  return (contract: RawPkh): Token["type"] | undefined => {
    const contractTokens = tokens[contract];
    if (!contractTokens) {
      return undefined;
    }
    const anyTokenId = Object.keys(contractTokens)[0];
    if (!anyTokenId) {
      return undefined;
    }
    return contractTokens[anyTokenId]?.type;
  };
};