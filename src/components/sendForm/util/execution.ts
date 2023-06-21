import { TezosNetwork } from "@airgap/tezos";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { SignerConfig } from "../../../types/SignerConfig";
import { proposeMultisigLambda, submitBatch } from "../../../utils/tezos";
import { FormOperations, OperationValue } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeProposeOperation = async (operations: OperationValue[], config: SignerConfig) => {
  const lambdaActions = await makeBatchLambda(
    operations.map(toLambdaOperation),
    TezosNetwork.GHOSTNET
  );
  const contract = parseContractPkh(operations[0].value.sender);

  return proposeMultisigLambda({ contract, lambdaActions }, config);
};
const makeTransferImplicit = async (operations: OperationValue[], config: SignerConfig) => {
  return submitBatch(operations, config).then(res => {
    return {
      hash: res.opHash,
    };
  });
};

export const makeTransfer = (op: FormOperations, config: SignerConfig) => {
  const transferToDisplay = op.content;

  const transfer =
    op.type === "proposal"
      ? makeProposeOperation(transferToDisplay, config)
      : makeTransferImplicit(transferToDisplay, config);

  return transfer;
};