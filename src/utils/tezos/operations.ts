import { TransactionOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { Operation } from "../../types/Operation";
import { SignerConfig } from "../../types/SignerConfig";
import {
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkitWithSigner,
} from "./helpers";
import { operationsToWalletParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const proposeMultisigLambda = async (
  params: MultisigProposeMethodArgs,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const proposeMethod = await makeMultisigProposeMethod(params, Tezos);
  return proposeMethod.send();
};

export const approveOrExecuteMultisigOperation = async (
  params: MultisigApproveOrExecuteMethodArgs,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, Tezos);
  return approveOrExecuteMethod.send();
};

export const submitBatch = async (
  operation: Operation[],
  config: SignerConfig
): Promise<BatchWalletOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const params = await operationsToWalletParams(operation, Tezos);
  return Tezos.wallet.batch(params).send();
};
