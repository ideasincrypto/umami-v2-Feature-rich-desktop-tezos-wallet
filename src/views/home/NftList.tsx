import { TabList, Tabs } from "@chakra-ui/react";
import { NFTsGrid } from "../../components/AccountCard/AssetsPanel/NFTsGrid";
import NestedScroll from "../../components/NestedScroll";
import SmallTab from "../../components/SmallTab";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
export const NftList = () => {
  const nfts = useAllNfts();

  return (
    <Tabs height="100%" display="flex" flexDirection="column" bg="umami.gray.900" borderRadius={4}>
      <TabList>
        <SmallTab>All NFTs</SmallTab>
      </TabList>

      <NestedScroll>
        <NFTsGrid nftsByOwner={nfts} columns={4} spacing={4} />
      </NestedScroll>
    </Tabs>
  );
};
