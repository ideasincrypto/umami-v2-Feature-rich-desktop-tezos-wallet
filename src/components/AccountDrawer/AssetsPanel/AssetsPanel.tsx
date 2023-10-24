import { Flex, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { Account, AccountType } from "../../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../../types/TokenBalance";
import { Delegation } from "../../../types/Delegation";
import { buildTzktAddressUrl } from "../../../utils/tzkt/helpers";
import { IconAndTextBtnLink } from "../../IconAndTextBtn";
import SmallTab from "../../SmallTab";
import { DelegationDisplay } from "./DelegationDisplay";
import MultisigPendingAccordion from "./MultisigPendingAccordion";
import { NFTsGrid } from "./NFTsGrid";
import { TokenList } from "./TokenList";

import { OperationListDisplay } from "../../../views/home/OperationListDisplay";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { OperationTileContext } from "../../OperationTile";
import { useGetOperations } from "../../../views/operations/useGetOperations";
import colors from "../../../style/colors";

export const AssetsPanel: React.FC<{
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
  delegation: Delegation | null;
}> = ({ tokens, nfts, account, delegation }) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  const network = useSelectedNetwork();
  const { operations, isFirstLoad: areOperationsLoading } = useGetOperations([account.address.pkh]);

  return (
    <Tabs
      height="100%"
      display="flex"
      flexDirection="column"
      mt="60px"
      data-testid="asset-panel"
      w="100%"
    >
      <TabList justifyContent="space-between" data-testid="asset-panel-tablist">
        <Flex>
          {isMultisig && <SmallTab data-testid="account-card-pending-tab">Pending</SmallTab>}
          <SmallTab>Operations</SmallTab>
          <SmallTab>Delegation</SmallTab>
          <SmallTab>NFTs</SmallTab>
          <SmallTab>Tokens</SmallTab>
        </Flex>

        <IconAndTextBtnLink
          data-testid="tzkt-link"
          icon={FiExternalLink}
          label="View on Tzkt"
          href={buildTzktAddressUrl(network, account.address.pkh)}
          textFirst
        />
      </TabList>
      <TabPanels height="100%">
        {isMultisig && (
          <TabPanel p="24px 0 60px 0" data-testid="account-card-pending-tab-panel">
            <MultisigPendingAccordion account={account} />
          </TabPanel>
        )}

        <TabPanel p="24px 0 60px 0" data-testid="account-card-operations-tab">
          <OperationTileContext.Provider
            value={{ mode: "drawer", selectedAddress: account.address }}
          >
            {areOperationsLoading ? (
              <Text textAlign="center" color={colors.gray[500]}>
                Loading...
              </Text>
            ) : (
              <OperationListDisplay operations={operations} />
            )}
          </OperationTileContext.Provider>
        </TabPanel>

        <TabPanel p="24px 0 60px 0" data-testid="account-card-delegation-tab">
          <DelegationDisplay account={account} delegation={delegation} />
        </TabPanel>

        <TabPanel
          p="24px 0 60px 0"
          data-testid="account-card-nfts-tab"
          height="100%"
          overflow="hidden"
        >
          <NFTsGrid nftsByOwner={{ [account.address.pkh]: nfts }} columns={3} spacing={5} />
        </TabPanel>

        <TabPanel p="24px 0 60px 0" data-testid="account-card-tokens-tab">
          <TokenList tokens={tokens} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};