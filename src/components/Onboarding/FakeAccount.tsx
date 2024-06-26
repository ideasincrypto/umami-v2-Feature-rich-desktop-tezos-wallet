/* istanbul ignore file */
import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { RpcClient } from "@taquito/rpc";
import { useForm } from "react-hook-form";

import { ModalContentWrapper } from "./ModalContentWrapper";
import { WalletPlusIcon } from "../../assets/icons";
import { MAINNET } from "../../types/Network";
import {
  defaultDerivationPathTemplate,
  makeDerivationPath,
} from "../../utils/account/derivationPathUtils";
import { useRestoreLedger } from "../../utils/hooks/setAccountDataHooks";

export const FakeAccount = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ pkh: string; name: string }>({ mode: "onBlur" });
  const restoreLedger = useRestoreLedger();

  const onSubmit = async ({ pkh, name }: { pkh: string; name: string }) => {
    const rpc = new RpcClient(MAINNET.rpcUrl);
    const managerKey = await rpc.getManagerKey(pkh);
    const pk = typeof managerKey === "string" ? managerKey : managerKey.key;
    restoreLedger(
      defaultDerivationPathTemplate,
      makeDerivationPath(defaultDerivationPathTemplate, 0),
      pk,
      pkh,
      name
    );
    onClose();
  };
  return (
    <ModalContentWrapper icon={<WalletPlusIcon />} title="Add a Fake Account">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Text>It will be restored as a ledger account</Text>
        <FormControl isInvalid={!!errors.pkh}>
          <FormLabel>Address</FormLabel>
          <Input
            {...register("pkh", { required: true })}
            autoComplete="off"
            placeholder="Please enter the account address"
          />
        </FormControl>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register("name", { required: true })}
            autoComplete="off"
            placeholder="Please enter the account name"
          />
        </FormControl>
        <Button width="100%" marginTop={2} size="lg" type="submit">
          Add account
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
