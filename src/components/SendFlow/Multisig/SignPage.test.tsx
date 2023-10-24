import { mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { TEZ } from "../../../utils/tezos";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { makeMultisigApproveOrExecuteOperation } from "../../../types/Operation";

const fixture = () => {
  const account = mockImplicitAccount(0);
  const multisig = mockMultisigAccount(1);
  const operation = makeAccountOperations(account, account, [
    makeMultisigApproveOrExecuteOperation(multisig.address, "execute", "3"),
  ]);
  return (
    <SignPage
      actionType="approve"
      fee={new BigNumber(1234567)}
      signer={account}
      operation={operation}
      transactionCount={1}
    />
  );
};

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", () => {
      render(fixture());
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });

  describe("number of transactions", () => {
    it("displays the correct number of transactions", () => {
      render(fixture());
      expect(screen.getByTestId("transaction-length")).toHaveTextContent("1");
    });
  });
});