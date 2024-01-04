import { fireEvent, render, screen } from "@testing-library/react";

import { Notice } from "./Notice";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { generate24WordMnemonic } from "../../../utils/mnemonic";
import { Step, StepType } from "../useOnboardingModal";

// TODO refactor mocks
jest.mock("../../../utils/mnemonic");

const generate24WordMnemonicMock = jest.mocked(generate24WordMnemonic);
const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void) => <Notice goToStep={goToStep} />;

describe("<Eula />", () => {
  describe("When shown", () => {
    test("press 'I understand'", async () => {
      generate24WordMnemonicMock.mockReturnValue(mnemonic1);
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", { name: /I understand/i });

      fireEvent.click(confirmBtn);
      expect(goToStepMock).toHaveBeenCalledWith({
        type: StepType.showSeedphrase,
        account: { type: "mnemonic", mnemonic: mnemonic1 },
      });
      expect(goToStepMock).toHaveBeenCalledTimes(1);
    });

    test("press 'I already have a Seed Phrase'", async () => {
      render(fixture(goToStepMock));
      const skipBtn = screen.getByRole("button", {
        name: /I already have a Seed Phrase/i,
      });
      fireEvent.click(skipBtn);
      expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.restoreMnemonic });
      expect(goToStepMock).toHaveBeenCalledTimes(1);
    });
  });
});
