import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import colors from "../../../style/colors";
import { parseContractPkh, parsePkh, RawPkh } from "../../../types/Address";
import { FA2Transfer } from "../../../types/Operation";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { formDefaultValues, FormPagePropsWithSender, FormSubmitButtons } from "../utils";
import SignPage from "./SignPage";
import { NFTBalance } from "../../../types/TokenBalance";
import { SendNFTRecapTile } from "../../sendForm/components/SendNFTRecapTile";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { FormErrorMessage } from "../../FormErrorMessage";
import FormPageHeader from "../FormPageHeader";

export type FormValues = {
  quantity: number;
  sender: RawPkh;
  recipient: RawPkh;
};

const toOperation =
  (nft: NFTBalance) =>
  (formValues: FormValues): FA2Transfer => ({
    type: "fa2",
    sender: parsePkh(formValues.sender),
    recipient: parsePkh(formValues.recipient),
    contract: parseContractPkh(nft.contract),
    tokenId: nft.tokenId,
    amount: formValues.quantity.toString(), // We assume NFT has 0 decimals
  });

const FormPage: React.FC<FormPagePropsWithSender<FormValues> & { nft: NFTBalance }> = props => {
  const { nft } = props;

  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: { nft },
    FormPage,
    defaultFormPageProps: props,
    toOperation: toOperation(nft),
  });

  const addToBatch = useAddToBatchFormAction(toOperation(nft));

  const {
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { quantity: 1, ...formDefaultValues(props) },
  });
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <FormPageHeader />
          <ModalBody>
            <Flex my={3}>
              <SendNFTRecapTile nft={props.nft} />
            </Flex>
            <Flex alignItems="center">
              <Heading size="sm" mr={1} color={colors.gray[450]}>
                Owned:
              </Heading>
              <Text size="sm" color={colors.gray[400]} data-testid="nft-owned">
                {nft.balance}
              </Text>
            </Flex>

            <FormControl my={4} isInvalid={!!errors.quantity}>
              <FormLabel>
                <Flex alignItems="center">
                  <Heading size="md" mr={2}>
                    Quantity:
                  </Heading>
                  <Flex alignItems="center">
                    <InputGroup w="75px">
                      <Input
                        w="60px"
                        type="number"
                        color="white"
                        step={1}
                        variant="filled"
                        data-testid="quantity-input"
                        {...register("quantity", {
                          required: "Quantity is required",
                          max: {
                            value: nft.balance,
                            message: `Max quantity is ${nft.balance}`,
                          },
                          min: {
                            value: 1,
                            message: `Min quantity is 1`,
                          },
                        })}
                      />
                    </InputGroup>
                    <Text data-testid="out-of-nft">out of {nft.balance}</Text>
                  </Flex>
                </Flex>
              </FormLabel>
              {errors.quantity && (
                <FormErrorMessage data-testid="quantity-error">
                  {errors.quantity.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl my={3} isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                inputName="sender"
                allowUnknown={false}
                isDisabled
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* TODO: fix scrolling */}
            <FormControl my={3} isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete label="To" inputName="recipient" allowUnknown />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
              onAddToBatch={handleSubmit(onBatchSubmit)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default FormPage;
