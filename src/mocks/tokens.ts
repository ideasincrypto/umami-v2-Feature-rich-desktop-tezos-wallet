import type { FA12Token, FA2Token, NFT } from "../types/Asset";
import { nftDisplayUri } from "../utils/tezos/consts";
import { publicKeys1 } from "./publicKeys";

export const ghostTezzard: NFT = {
  id: 1,
  type: "nft",
  contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
  tokenId: "6",
  balance: "1",
  owner: publicKeys1.pkh,
  displayUri: nftDisplayUri,
  totalSupply: "1",
  metadata: {
    displayUri: nftDisplayUri,
    name: "Tezzardz #24",
    symbol: "FKR",
  },
};

export const ghostFA12: FA12Token = {
  type: "fa1.2",
  contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
  balance: "1",
};

export const ghostFA12WithOwner = {
  ...ghostFA12,
  owner: publicKeys1.pkh,
};

export const ghostFA2: FA2Token = {
  type: "fa2",
  contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
  tokenId: "1",
  balance: "1",
  metadata: {
    name: "Klondike3",
    symbol: "KL3",
    decimals: "5",
  },
};

export const ghostFA2WithOwner = {
  ...ghostFA2,
  owner: publicKeys1.pkh,
};
