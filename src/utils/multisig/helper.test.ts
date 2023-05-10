import { mockContract, mockPkh } from "../../mocks/factories";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { makeMultisigLookups } from "./helpers";

describe("multisig helpers", () => {
  test("makeMultisigLookups", async () => {
    const accounts = new Set([mockPkh(0), mockPkh(1), mockPkh(2)]);
    const multisigs: tzktGetSameMultisigsResponseType = [
      {
        balance: 0,
        address: mockContract(0),
        storage: { signers: [mockPkh(0)] },
      },
      {
        balance: 0,
        address: mockContract(1),
        storage: { signers: [mockPkh(0), mockPkh(2), mockPkh(3)] },
      },
      {
        balance: 0,
        address: mockContract(2),
        storage: { signers: [mockPkh(3), mockPkh(4), mockPkh(5)] },
      },
    ];

    const { accountToMultisigs, multiSigToSigners } = makeMultisigLookups(
      accounts,
      multisigs
    );

    expect(multiSigToSigners).toEqual({
      [mockContract(0)]: [mockPkh(0)],
      [mockContract(1)]: [mockPkh(0), mockPkh(2), mockPkh(3)],
    });

    expect(accountToMultisigs).toEqual({
      [mockPkh(0)]: [mockContract(0), mockContract(1)],
      [mockPkh(2)]: [mockContract(1)],
    });
  });
});
