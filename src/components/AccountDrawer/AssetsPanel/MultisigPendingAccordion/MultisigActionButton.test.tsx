import { mockMnemonicAccount, mockMultisigAccount } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";

import store from "../../../../utils/redux/store";
import MultisigActionButton from "./MultisigSignerTile";
import accountsSlice from "../../../../utils/redux/slices/accountsSlice";
import { pendingOps } from "../../../../mocks/multisig";

const { addMockMnemonicAccounts } = accountsSlice.actions;
const account = mockMnemonicAccount(0);

describe("<ActionButton/>", () => {
  it("should display execute for non-pending operation with signer included in the owned account", () => {
    store.dispatch(addMockMnemonicAccounts([account]));
    render(
      <MultisigActionButton
        signerAddress={account.address}
        pendingApprovals={0}
        operation={pendingOps[0]}
        sender={mockMultisigAccount(0)}
      />
    );
    expect(screen.getByTestId("multisig-signer-button")).toHaveTextContent("Execute");
  });

  it("should display approve for pending operation with signer included in the owned account", () => {
    store.dispatch(addMockMnemonicAccounts([account]));
    render(
      <MultisigActionButton
        signerAddress={account.address}
        pendingApprovals={1}
        operation={pendingOps[0]}
        sender={mockMultisigAccount(0)}
      />
    );
    expect(screen.getByTestId("multisig-signer-button")).toHaveTextContent("Approve");
  });

  it("should show approved for pending operation with signers included in the account that already approved", () => {
    store.dispatch(addMockMnemonicAccounts([account]));
    const operation = { ...pendingOps[0], approvals: [account.address] };
    render(
      <MultisigActionButton
        signerAddress={account.address}
        pendingApprovals={1}
        operation={operation}
        sender={mockMultisigAccount(0)}
      />
    );
    expect(screen.getByTestId("multisig-signer-approved")).toHaveTextContent("Approved");
  });

  it("should show approved for operation with signers not in the account", () => {
    const operation = { ...pendingOps[0], approvals: [account.address] };
    render(
      <MultisigActionButton
        signerAddress={account.address}
        pendingApprovals={1}
        operation={operation}
        sender={mockMultisigAccount(0)}
      />
    );
    expect(screen.getByTestId("multisig-signer-approved")).toHaveTextContent("Approved");
  });

  it("should show Awaiting approval for operation with signers not owned by the user account that hasn't approved", () => {
    render(
      <MultisigActionButton
        signerAddress={account.address}
        pendingApprovals={1}
        operation={pendingOps[0]}
        sender={mockMultisigAccount(0)}
      />
    );
    expect(screen.getByTestId("multisig-signer-awaiting-approval")).toHaveTextContent(
      "Awaiting Approval"
    );
  });
});