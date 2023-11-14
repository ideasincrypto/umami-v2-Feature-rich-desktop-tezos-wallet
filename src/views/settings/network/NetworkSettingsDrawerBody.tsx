import PlusIcon from "../../../assets/icons/Plus";
import { UpsertNetworkModal } from "./UpsertNetworkModal";
import {
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "../../../utils/hooks/networkHooks";
import colors from "../../../style/colors";
import { Fragment, useContext } from "react";
import { Network, isDefault } from "../../../types/Network";
import PopoverMenu from "../../../components/PopoverMenu";
import TrashIcon from "../../../assets/icons/Trash";
import { useAppDispatch } from "../../../utils/redux/hooks";
import { networksActions } from "../../../utils/redux/slices/networks";
import PenIcon from "../../../assets/icons/Pen";
import { DynamicModalContext } from "../../../components/DynamicModal";
import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

export const NetworkSettingsDrawerBody = () => {
  const { openWith } = useContext(DynamicModalContext);
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const availableNetworks = useAvailableNetworks();
  const dispatch = useAppDispatch();

  const removeNetwork = (network: Network) => {
    dispatch(networksActions.removeNetwork(network));
  };
  return (
    <Flex flexDirection="column">
      <Center justifyContent="space-between">
        <Heading>Network Settings</Heading>
        <Button
          variant="CTAWithIcon"
          onClick={() => openWith(<UpsertNetworkModal />)}
          paddingRight="0"
        >
          <Text size="sm">Add Network</Text>
          <PlusIcon ml="4px" height="18px" width="18px" stroke="currentcolor" />
        </Button>
      </Center>
      <RadioGroup mt="60px" onChange={selectNetwork} value={network.name}>
        <Stack>
          {availableNetworks.map(network => (
            <Fragment key={network.name}>
              <Divider borderColor={colors.gray[700]} />
              <Flex justifyContent="space-between" data-testid={`network-${network.name}`}>
                <Radio height="100px" variant="primary" value={network.name}>
                  <Flex ml="16px" flexDirection="column">
                    <Heading size="sm" mb="4px">
                      {network.name}
                    </Heading>
                    <Text color={colors.gray[400]}>{network.rpcUrl}</Text>
                  </Flex>
                </Radio>
                {!isDefault(network) && (
                  <Center data-testid="popover-menu">
                    <PopoverMenu>
                      <Button
                        variant="popover"
                        onClick={() => openWith(<UpsertNetworkModal network={network} />)}
                      >
                        <Text mr="4px">Edit</Text>
                        <PenIcon />
                      </Button>
                      <Divider mt="4px" />
                      <Button variant="popover" onClick={() => removeNetwork(network)}>
                        <Text mr="4px">Remove</Text>
                        <TrashIcon />
                      </Button>
                    </PopoverMenu>
                  </Center>
                )}
              </Flex>
            </Fragment>
          ))}
        </Stack>
      </RadioGroup>
    </Flex>
  );
};