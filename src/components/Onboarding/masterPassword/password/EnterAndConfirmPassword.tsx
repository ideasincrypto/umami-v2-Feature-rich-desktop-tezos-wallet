import { Button, FormControl } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import ModalContentWrapper from "../../ModalContentWrapper";
import { FormErrorMessage } from "../../../FormErrorMessage";
import PasswordInput from "../../../PasswordInput";
import LockIcon from "../../../../assets/icons/Lock";

export const MIN_LENGTH = 8;

export const EnterAndConfirmPassword: React.FC<{
  onSubmit: (password: string) => void;
  isLoading: boolean;
}> = ({ onSubmit: onSubmitPassword, isLoading }) => {
  type ConfirmPasswordFormValues = {
    password: string;
    confirm: string;
  };

  const form = useForm<ConfirmPasswordFormValues>({
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = form;

  const onSubmit = async (data: ConfirmPasswordFormValues) => {
    onSubmitPassword(data.confirm);
  };

  return (
    <ModalContentWrapper
      icon={<LockIcon />}
      title="Umami Master Password"
      subtitle="Please choose a master password for Umami. You will need to use this password in order to perform any operations within Umami."
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <FormControl isInvalid={!!errors.password}>
            <PasswordInput
              inputName="password"
              data-testid="password"
              placeholder="Enter master password"
            />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>

          <FormControl marginTop="24px" isInvalid={!!errors.confirm}>
            <PasswordInput
              inputName="confirm"
              label="Confirm Password"
              data-testid="confirmation"
              placeholder="Confirm your password"
              required="Confirmation is required"
              validate={(val: string) =>
                getValues("password") === val || "Your passwords do no match"
              }
            />
            {errors.confirm && <FormErrorMessage>{errors.confirm.message}</FormErrorMessage>}
          </FormControl>
          <Button
            width="100%"
            marginTop="32px"
            isDisabled={!isValid || isLoading}
            isLoading={isLoading}
            size="lg"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </ModalContentWrapper>
  );
};

export default EnterAndConfirmPassword;
