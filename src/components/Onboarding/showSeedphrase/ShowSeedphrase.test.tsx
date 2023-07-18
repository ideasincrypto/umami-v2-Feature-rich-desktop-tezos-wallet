import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import { ShowSeedphrase } from "./ShowSeedphrase";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void) => {
  const account = { type: "mnemonic" as const, seedphrase: seedPhrase };
  return <ShowSeedphrase goToStep={goToStep} account={account} />;
};

describe("<ShowSeedphrase />", () => {
  test("seedphrase is displayed", async () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", {
      name: /OK, I've recorded it/i,
    });
    seedPhrase.split(" ").forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
    expect(confirmBtn).toBeEnabled();
    fireEvent.click(confirmBtn);
    expect(goToStepMock).toBeCalledTimes(1);
    expect(goToStepMock).toBeCalledWith({
      type: StepType.verifySeedphrase,
      account: {
        type: "mnemonic",
        seedphrase: seedPhrase,
      },
    });
  });
});