import { makeDefaultDevSigner } from "../mocks/devSignerKeys";
import { mockImplicitAccount } from "../mocks/factories";
import { parseContractPkh, parseImplicitPkh } from "../types/Address";
import { TezosNetwork } from "../types/TezosNetwork";
import { tezToMutez } from "../utils/format";
import { getPendingOperations } from "../utils/multisig/fetch";
import {
  approveOrExecuteMultisigOperation,
  estimateMultisigApproveOrExecute,
  estimateMultisigPropose,
  getAccounts,
  makeToolkit,
  proposeMultisigLambda,
  submitBatch,
} from "../utils/tezos";
import { makeBatchLambda } from "./multisigUtils";

jest.unmock("../utils/tezos");

jest.setTimeout(90000);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Originated multisig on ghostnet
// threshold: 2
// singers: makeDevDefaultSigner(0), makeDevDefaultSigner(1)
// Pre funded with FA1.2 token (KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe).
// KL2 FA2 token (KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ).
const MULTISIG_GHOSTNET_1 = parseContractPkh("KT1GTYqMXwnsvqYwNGcTHcgqNRASuyM5TzY8");
const MULTISIG_GHOSTNET_1_PENDING_OPS_BIG_MAP = 238447;
const FA12_TOKEN_CONTRACT = parseContractPkh("KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe");
const FA2_KL2_CONTRACT = parseContractPkh("KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ");

describe("multisig Sandbox", () => {
  test.skip("propose, approve and execute batch tez/FA transfers", async () => {
    const TEZ_TO_SEND = 1;
    const devAccount0 = makeDefaultDevSigner(0);
    const devAccount1 = makeDefaultDevSigner(1);
    const devAccount2 = makeDefaultDevSigner(2);
    const devAccount2Address = parseImplicitPkh(await devAccount2.publicKeyHash());
    const devAccount0Sk = await devAccount0.secretKey();
    const devAccount1Sk = await devAccount1.secretKey();
    const devAccount2Sk = await devAccount2.secretKey();
    const accountInfos = await getAccounts([devAccount2Address.pkh], TezosNetwork.GHOSTNET);
    const { balance: preDevAccount2TezBalance } = accountInfos[0];
    // First, devAccount2 send tez to MULTISIG_GHOSTNET_1
    await submitBatch(
      [
        {
          type: "tez",
          amount: tezToMutez(TEZ_TO_SEND.toString()).toString(),
          recipient: MULTISIG_GHOSTNET_1,
        },
      ],
      {
        ...mockImplicitAccount(0),
        address: parseImplicitPkh(await devAccount2.publicKeyHash()),
        pk: await devAccount2.publicKey(),
      },
      await makeToolkit({
        type: "mnemonic",
        secretKey: devAccount2Sk,
        network: TezosNetwork.GHOSTNET,
      })
    );
    await sleep(15000);

    // devAccount0 propose a batch tez/FA tranfer to devAccount2
    // devAccount0 is going to be in the approvers as well.
    const lambdaActions = makeBatchLambda([
      {
        type: "tez",
        recipient: devAccount2Address,
        amount: tezToMutez(TEZ_TO_SEND.toString()).toString(),
      },
      {
        type: "fa1.2",
        sender: MULTISIG_GHOSTNET_1,
        recipient: devAccount2Address,
        contract: FA12_TOKEN_CONTRACT,
        tokenId: "0",
        amount: "2",
      },
      {
        type: "fa2",
        sender: MULTISIG_GHOSTNET_1,
        recipient: devAccount2Address,
        contract: FA2_KL2_CONTRACT,
        amount: "3",
        tokenId: "0",
      },
    ]);
    const proposeEstimate = await estimateMultisigPropose(
      { contract: MULTISIG_GHOSTNET_1, lambdaActions },
      {
        ...mockImplicitAccount(0),
        address: parseImplicitPkh(await devAccount0.publicKeyHash()),
        pk: await devAccount0.publicKey(),
      },
      TezosNetwork.GHOSTNET
    );
    expect(proposeEstimate).toHaveProperty("suggestedFeeMutez");
    const proposeResponse = await proposeMultisigLambda(
      {
        contract: MULTISIG_GHOSTNET_1,
        lambdaActions,
      },
      await makeToolkit({
        type: "mnemonic",
        secretKey: devAccount0Sk,
        network: TezosNetwork.GHOSTNET,
      })
    );
    expect(proposeResponse.hash).toBeTruthy();
    console.log("propose done");
    await sleep(15000);
    // get the operation id of the proposal.
    const pendingOps = await getPendingOperations(
      [MULTISIG_GHOSTNET_1_PENDING_OPS_BIG_MAP],
      TezosNetwork.GHOSTNET
    );
    const activeOps = pendingOps.filter(({ active }) => active);
    expect(activeOps.length).toBeGreaterThanOrEqual(1);
    const pendingOpKey = activeOps[activeOps.length - 1].key;
    expect(pendingOpKey).toBeTruthy();
    // devAccount1 approves the proposal, meeting the threshold
    const approveEstimate = await estimateMultisigApproveOrExecute(
      {
        type: "approve",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      {
        ...mockImplicitAccount(0),
        address: parseImplicitPkh(await devAccount1.publicKeyHash()),
        pk: await devAccount1.publicKey(),
      },
      TezosNetwork.GHOSTNET
    );
    expect(approveEstimate).toHaveProperty("suggestedFeeMutez");
    const approveResponse = await approveOrExecuteMultisigOperation(
      {
        type: "approve",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      await makeToolkit({
        type: "mnemonic",
        secretKey: devAccount1Sk,
        network: TezosNetwork.GHOSTNET,
      })
    );
    expect(approveResponse.hash).toBeTruthy();
    console.log("approve done");
    await sleep(15000);
    // The proposal to transfer to DevAccount2 can be executed
    const executeEstimate = await estimateMultisigApproveOrExecute(
      {
        type: "execute",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      {
        ...mockImplicitAccount(0),
        address: parseImplicitPkh(await devAccount1.publicKeyHash()),
        pk: await devAccount1.publicKey(),
      },
      TezosNetwork.GHOSTNET
    );
    expect(executeEstimate).toHaveProperty("suggestedFeeMutez");
    const executeResponse = await approveOrExecuteMultisigOperation(
      {
        type: "execute",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      await makeToolkit({
        type: "mnemonic",
        secretKey: devAccount1Sk,
        network: TezosNetwork.GHOSTNET,
      })
    );
    expect(executeResponse.hash).toBeTruthy();
    console.log("execute done");
    await sleep(25000);
    const accountInfosAfter = await getAccounts([devAccount2Address.pkh], TezosNetwork.GHOSTNET);
    const { balance: postDevAccount2TezBalance } = accountInfosAfter[0];
    const AVERAGE_FEE = 500;
    expect(preDevAccount2TezBalance - postDevAccount2TezBalance <= AVERAGE_FEE).toEqual(true);
  });
});
