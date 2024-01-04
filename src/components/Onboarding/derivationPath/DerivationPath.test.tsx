import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { DerivationPath } from "./DerivationPath";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { DerivationPathStep, Step, StepType } from "../useOnboardingModal";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: DerivationPathStep["account"]) => (
  <DerivationPath account={account} goToStep={goToStep} />
);

describe("<DerivationPath />", () => {
  const testData = [
    {
      account: { type: "ledger" as const, label: "ledger account" },
      nextPage: StepType.restoreLedger,
      derivationPath: "44'/1729'/?'/0'",
    },
    {
      account: { type: "mnemonic" as const, label: "mnemonic account", mnemonic: mnemonic1 },
      nextPage: StepType.masterPassword,
      derivationPath: "44'/1729'/?'/0'",
    },
  ];

  describe.each(testData)("For $account.type", ({ account, nextPage, derivationPath }) => {
    it("uses default path", async () => {
      const user = userEvent.setup();
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      await waitFor(() => {
        expect(confirmBtn).toBeEnabled();
      });
      user.click(confirmBtn);
      await waitFor(() => {
        expect(goToStepMock).toHaveBeenCalledTimes(1);
      });
      expect(goToStepMock).toHaveBeenCalledWith({
        type: nextPage,
        account: {
          ...account,
          derivationPath,
        },
      });
    });

    it("allows to select a custom path", async () => {
      const user = userEvent.setup();
      const standard5PieceDerivationPath = "44'/1729'/?'/0'/0'";

      render(fixture(goToStepMock, account));

      const confirmBtn = screen.getByRole("button", { name: /continue/i });

      user.click(screen.getByTestId("select-input"));
      await waitFor(() => {
        expect(screen.getByTestId("select-options")).toBeInTheDocument();
      });

      user.click(screen.getByText(`m/${standard5PieceDerivationPath}`));
      await waitFor(() => {
        expect(screen.getByTestId("select-input")).toHaveTextContent(standard5PieceDerivationPath);
      });
      expect(confirmBtn).toBeEnabled();
      user.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toHaveBeenCalledTimes(1);
      });

      expect(goToStepMock).toHaveBeenCalledWith({
        type: nextPage,
        account: {
          ...account,
          derivationPath: standard5PieceDerivationPath,
        },
      });
    });
  });
});
