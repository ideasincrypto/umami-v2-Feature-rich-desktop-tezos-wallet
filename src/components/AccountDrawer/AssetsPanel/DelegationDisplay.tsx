import { Box, Button, Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import colors from "../../../style/colors";
import { parsePkh } from "../../../types/Address";
import { Delegation } from "../../../types/Delegation";
import { useGetDelegationPrettyDisplayValues } from "../../../utils/hooks/delegationHooks";
import AddressPill from "../../AddressPill/AddressPill";
import { NoDelegations } from "../../NoItems";
import { DynamicModalContext } from "../../DynamicModal";
import { useContext } from "react";
import DelegationFormPage from "../../SendFlow/Delegation/FormPage";
import UndelegationFormPage from "../../SendFlow/Undelegation/FormPage";
import { useGetOwnedAccount } from "../../../utils/hooks/getAccountDataHooks";
import { Account } from "../../../types/Account";

const Row: React.FC<
  {
    label: string;
    value: string | ReactNode;
  } & FlexProps
> = ({ label, value, ...props }) => {
  return (
    <Flex alignItems="center" height="50px" padding="16px" data-testid={label} {...props}>
      <Box flex={1}>
        <Heading color={colors.gray[400]} size="sm">
          {label}
        </Heading>
      </Box>
      <Box flex={1}>{typeof value === "string" ? <Text size="sm">{value}</Text> : value}</Box>
    </Flex>
  );
};

export const DelegationDisplay: React.FC<{
  account: Account;
  delegation: Delegation | null;
}> = ({ delegation, account }) => {
  const { openWith } = useContext(DynamicModalContext);
  const getOwnedAccount = useGetOwnedAccount();
  const getDelegationPrettyDisplay = useGetDelegationPrettyDisplayValues();
  if (!delegation) {
    return (
      <NoDelegations
        small
        onDelegate={() => {
          openWith(<DelegationFormPage sender={account} />);
        }}
      />
    );
  }

  const { currentBalance, duration, initialBalance } = getDelegationPrettyDisplay(delegation);
  const {
    sender,
    delegate: { address: baker },
  } = delegation;
  const senderAccount = getOwnedAccount(sender);

  return (
    <Box>
      <Row
        label="Initial Balance:"
        value={initialBalance}
        borderTopRadius="8px"
        borderBottom={`1px solid ${colors.gray[700]}`}
        _odd={{ bg: colors.gray[800] }}
      />
      {currentBalance && (
        <Row label="Current Balance:" _odd={{ bg: colors.gray[800] }} value={currentBalance} />
      )}
      <Row
        label="Duration:"
        _odd={{ bg: colors.gray[800] }}
        value={duration}
        borderBottom={`1px solid ${colors.gray[700]}`}
      />
      <Row
        label="Baker:"
        _odd={{ bg: colors.gray[800] }}
        borderBottomRadius="8px"
        value={<AddressPill address={parsePkh(delegation.delegate.address)} />}
      />

      <Flex marginTop="24px">
        <Button
          flex={1}
          marginRight="16px"
          onClick={() =>
            openWith(<UndelegationFormPage sender={senderAccount} form={{ sender, baker }} />)
          }
          variant="warning"
        >
          End Delegation
        </Button>
        <Button
          flex={1}
          onClick={() => {
            openWith(<DelegationFormPage sender={senderAccount} form={{ sender, baker }} />);
          }}
          variant="tertiary"
        >
          Change Baker
        </Button>
      </Flex>
    </Box>
  );
};
