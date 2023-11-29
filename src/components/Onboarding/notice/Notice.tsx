import { Box, Button, ListItem, OrderedList } from "@chakra-ui/react";
import React from "react";

import { NoticeIcon } from "../../../assets/icons";
import { generate24WordMnemonic } from "../../../utils/mnemonic";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

export const Notice: React.FC<{
  goToStep: (step: Step) => void;
}> = ({ goToStep }) => {
  const noticeItems = [
    {
      content: "Write down your seed phrase and store it in a safe place.",
    },
    {
      content: "Make sure there is no one around you or looking over your shoulder.",
    },
    {
      content: "Do not copy and paste the Seed Phrase or store it on your device.",
    },
    {
      content: "Do not take a screenshot of your Seed Phrase.",
    },
  ];
  return (
    <ModalContentWrapper
      icon={<NoticeIcon />}
      subtitle="Please read the following before you continue to see your secret Seed Phrase."
      title="Important Notice"
    >
      <Box>
        <OrderedList spacing="12px">
          {noticeItems.map((item, index) => {
            return <ListItem key={index}>{item.content}</ListItem>;
          })}
        </OrderedList>
        <Button
          width="100%"
          marginTop="28px"
          onClick={() =>
            goToStep({
              type: StepType.showSeedphrase,
              account: { type: "mnemonic", mnemonic: generate24WordMnemonic() },
            })
          }
          size="lg"
        >
          I understand
        </Button>
        <Button
          width="100%"
          marginTop="16px"
          onClick={() => goToStep({ type: StepType.restoreMnemonic })}
          size="lg"
          variant="tertiary"
        >
          I already have a Seed Phrase
        </Button>
      </Box>
    </ModalContentWrapper>
  );
};
