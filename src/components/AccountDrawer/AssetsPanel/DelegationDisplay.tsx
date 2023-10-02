import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
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
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { Account } from "../../../types/Account";

const Row: React.FC<{
  label: string;
  value: string | ReactNode;
  grayBg?: boolean;
}> = ({ label, value, grayBg }) => {
  return (
    <Flex
      data-testid={label}
      bg={grayBg ? "umami.gray.800" : "initial"}
      h="50px"
      alignItems="center"
      borderBottom={`1px solid ${colors.gray[700]}`}
    >
      <Box flex={1}>
        <Heading size="sm" color="text.dark">
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
      <Row label="Initial Balance:" value={initialBalance} grayBg />
      {currentBalance && <Row label="Current Balance:" value={currentBalance} />}
      <Row label="Duration:" value={duration} />
      <Row label="Baker:" value={<AddressPill address={parsePkh(delegation.delegate.address)} />} />

      <Flex>
        <Button
          flex={1}
          mr={2}
          onClick={() => {
            openWith(<DelegationFormPage sender={senderAccount} form={{ sender, baker }} />);
          }}
        >
          Change Baker
        </Button>
        <Button
          flex={1}
          ml={2}
          onClick={() => openWith(<UndelegationFormPage sender={senderAccount} />)}
        >
          End Delegation
        </Button>
      </Flex>
    </Box>
  );
};