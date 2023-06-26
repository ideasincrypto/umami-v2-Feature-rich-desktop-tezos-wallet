import {
  Box,
  Flex,
  Text,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import React from "react";
import colors from "../../../../style/colors";
import { MultisigOperation } from "../../../../utils/multisig/types";
import MultisigSignerTile from "./MultisigSignerTile";
import { ImplicitAddress } from "../../../../types/Address";
import MultisigOperationsDisplay from "./MultisigDecodedOperations";

export const MultisigPendingCard: React.FC<{
  operation: MultisigOperation;
  signers: ImplicitAddress[];
  threshold: number;
}> = ({ operation, signers, threshold }) => {
  const pendingApprovals = Math.max(threshold - operation.approvals.length, 0);
  return (
    <Box bg={colors.gray[800]} p={3} borderRadius={6} marginY={3}>
      <Accordion allowMultiple={true} defaultIndex={[0]}>
        <AccordionItem bg={colors.gray[800]} border="none" borderRadius="8px">
          <h2>
            <AccordionButton as="span" flex="1" textAlign="left">
              <Heading w="100%" size="sm">
                Pending #{operation.key}
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Flex marginY={2} justifyContent="space-between" alignItems="end">
              <MultisigOperationsDisplay rawActions={operation.rawActions} />
              <Flex alignItems="center" mb="6">
                <Heading color={colors.gray[400]} size="sm" mr={1}>
                  Pending Approvals:
                </Heading>
                <Text color="w" data-testid="pending-approvals-count">
                  {pendingApprovals}
                </Text>
              </Flex>
            </Flex>

            <Box marginY={5}>
              {signers.map(signer => (
                <MultisigSignerTile
                  key={signer.pkh}
                  signer={signer}
                  approvers={operation.approvals}
                  pendingApprovals={pendingApprovals}
                />
              ))}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default MultisigPendingCard;
