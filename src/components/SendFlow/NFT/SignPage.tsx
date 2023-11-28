import {
  Center,
  Flex,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { NFTBalance } from "../../../types/TokenBalance";
import { FA2Transfer } from "../../../types/Operation";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../SignButton";
import { SendNFTRecapTile } from "../SendNFTRecapTile";

const SignPage: React.FC<SignPageProps<{ nft: NFTBalance }>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { nft },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const { recipient } = operations.operations[0] as FA2Transfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <Flex marginBottom="12px">
              <SendNFTRecapTile nft={nft} />
            </Flex>

            <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
              <Flex alignItems="center">
                <Heading marginRight="4px" color={colors.gray[450]} size="sm">
                  Owned:
                </Heading>
                <Text color={colors.gray[400]} data-testid="nft-owned" size="sm">
                  {nft.balance}
                </Text>
              </Flex>

              <SignPageFee fee={fee} />
            </Flex>

            <Flex alignItems="center" marginTop="12px" marginBottom="24px">
              <Heading marginRight="12px" size="md">
                Quantity:
              </Heading>
              <Center width="100px" height="48px" background={colors.gray[800]} borderRadius="4px">
                <Text textAlign="center">
                  {(operations.operations[0] as FA2Transfer).amount} out of {nft.balance}
                </Text>
              </Center>
            </Flex>

            <FormLabel>From</FormLabel>
            <AddressTile mb="24px" address={operations.sender.address} />
            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              sender={operations.sender}
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
            />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              isDisabled={estimationFailed}
              signer={signer}
              onSubmit={onSign}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default SignPage;
