import { Box, Divider, Flex } from "@chakra-ui/react";
import { useAccountsFilterWithMapFilter } from "../../components/useAccountsFilter";
import { NoOperations } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useGetOperations } from "./useGetOperations";
import { OperationTile, OperationTileContext } from "../../components/OperationTile";
import colors from "../../style/colors";
import { useEffect } from "react";

const OperationsView = () => {
  const { accountsFilter, selectedAccounts } = useAccountsFilterWithMapFilter();
  const { operations, setAddresses } = useGetOperations(
    selectedAccounts.map(acc => acc.address.pkh)
  );
  const addressesJoined = selectedAccounts.map(acc => acc.address.pkh).join(",");

  useEffect(() => {
    setAddresses(addressesJoined.split(","));
  }, [setAddresses, addressesJoined]);

  return (
    <Flex direction="column" height="100%" px="6px">
      <TopBar title="Operations" />
      {accountsFilter}
      <Box overflowY="scroll" borderRadius="8px" p="20px" bg={colors.gray[900]}>
        {operations.length === 0 ? (
          <NoOperations />
        ) : (
          <OperationTileContext.Provider value={{ mode: "page" }}>
            {operations.map(operation => (
              <Box key={operation.id} height="90px">
                <OperationTile operation={operation} />
                <Divider mt="20px" />
              </Box>
            ))}
          </OperationTileContext.Provider>
        )}
      </Box>
    </Flex>
  );
};

export default OperationsView;
