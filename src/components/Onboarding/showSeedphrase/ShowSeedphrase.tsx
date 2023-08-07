import { Box, Button, SimpleGrid, VStack } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { ShowSeedphraseStep, Step, StepType } from "../useOnboardingModal";

export const ShowSeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: ShowSeedphraseStep["account"];
}) => {
  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Record Seed Phrase"
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
    >
      <VStack overflowX="hidden">
        <SimpleGrid columns={3} spacing={2}>
          {account.seedphrase.split(" ").map((item, index) => {
            return (
              <Box
                key={index}
                fontSize="sm"
                width="140px"
                border="1px dashed #D6D6D6;"
                borderRadius="4px"
                p="6px"
              >
                <Box
                  w="18px!important"
                  float="left"
                  width="30px"
                  textAlign="right"
                  p="0"
                  pr="10px"
                  color="umami.gray.450"
                >
                  {index + 1}
                </Box>
                {item}
              </Box>
            );
          })}
        </SimpleGrid>
        <Button
          bg="umami.blue"
          w="100%"
          size="lg"
          minH="48px"
          onClick={_ => {
            goToStep({ type: StepType.verifySeedphrase, account });
          }}
        >
          OK, I've recorded it
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
export default ShowSeedphrase;