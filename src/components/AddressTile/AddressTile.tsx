import { Flex, Text, Heading, FlexProps, Box } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import useAddressKind from "./useAddressKind";
import AddressTileIcon from "./AddressTileIcon";
import { formatPkh } from "../../utils/format";
import colors from "../../style/colors";
import { AccountBalance } from "../AccountBalance";

const AddressTile: React.FC<{ address: Address } & FlexProps> = ({ address, ...flexProps }) => {
  const addressKind = useAddressKind(address);

  return (
    <Flex
      data-testid="address-tile"
      alignItems="center"
      w="400px"
      p="9px 10px"
      borderRadius="4px"
      bg={colors.gray[800]}
      justifyContent="space-between"
      {...flexProps}
    >
      <Flex alignItems="center">
        <AddressTileIcon addressKind={addressKind} />

        {addressKind.type === "unknown" ? (
          <Text color={colors.gray[300]} size="sm" ml="10px">
            {address.pkh}
          </Text>
        ) : (
          <>
            <Box ml="12px" width="102px" whiteSpace="nowrap" overflow="hidden">
              <Heading size="sm" overflow="hidden" textOverflow="ellipsis">
                {addressKind.label}
              </Heading>
            </Box>
            <Text color={colors.gray[300]} size="xs" ml="10px" width="89px">
              {formatPkh(addressKind.pkh)}
            </Text>
          </>
        )}
      </Flex>

      <AccountBalance textAlign="right" overflow="hidden" address={address.pkh} />
    </Flex>
  );
};

export default AddressTile;