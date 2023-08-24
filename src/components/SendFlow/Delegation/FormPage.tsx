import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { parsePkh, RawPkh, parseImplicitPkh } from "../../../types/Address";
import { BakersAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { formDefaultValues, FormPageProps, FormSubmitButtons } from "../utils";
import SignPage from "./SignPage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { DelegationOperation } from "../../../types/Operation";
import { FormErrorMessage } from "../../FormErrorMessage";

export type FormValues = {
  sender: RawPkh;
  baker: RawPkh;
};

const toOperation = (formValues: FormValues): DelegationOperation => ({
  type: "delegation",
  sender: parsePkh(formValues.sender),
  recipient: parseImplicitPkh(formValues.baker),
});

const FormPage: React.FC<FormPageProps<FormValues>> = props => {
  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: undefined,
    FormPage,
    defaultFormPageProps: props,
    toOperation,
  });

  const addToBatch = useAddToBatchFormAction(toOperation);

  const {
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });

  const {
    formState: { isValid, errors },
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <ModalHeader textAlign="center" p="40px 0 32px 0">
            <Text size="2xl" fontWeight="600">
              Delegation
            </Text>

            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            {/* TODO: Make AccountAutoComplete display the address and balance*/}
            <FormControl mb={2} isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                isDisabled={!!props.sender}
                inputName="sender"
                allowUnknown={false}
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={2} isInvalid={!!errors.baker} data-testid="baker">
              <BakersAutocomplete label="Baker" inputName="baker" allowUnknown={true} />
              {errors.baker && <FormErrorMessage>{errors.baker.message}</FormErrorMessage>}
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
