import { ExtendedPeerInfo, getSenderId } from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { capitalize, noop } from "lodash";
import { Fragment, useEffect, useState } from "react";

import { usePeers, useRemovePeer } from "./beacon";
import { TrashIcon } from "../../assets/icons";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { useGetConnectionInfo } from "../hooks/beaconHooks";

/**
 * Component displaying a list of connected dApps.
 *
 * Loads dApps data from {@link usePeers} hook & zips it with generated dAppIds.
 */
export const BeaconPeers = () => {
  const { data } = usePeers();

  const removePeer = useRemovePeer();
  const [peersWithId, setPeersWithId] = useState<ExtendedPeerInfo[]>([]);

  // senderId will always be set here, even if we haven't saved it in beaconSlice for a dApp.
  useEffect(() => {
    const peerIdPromises = (data || []).map(async peer => ({
      ...peer,
      senderId: peer.senderId || (await getSenderId(peer.publicKey)),
    }));

    Promise.all(peerIdPromises).then(setPeersWithId).catch(noop);
  }, [data]);

  if (peersWithId.length === 0) {
    return (
      <Box data-testid="beacon-peers-empty">
        <Divider />
        <Text marginTop="31px" color={colors.gray[400]} size="lg">
          Your dApps will appear here
        </Text>
      </Box>
    );
  }

  return (
    <PeersDisplay data-testid="beacon-peers" peerInfos={peersWithId} removePeer={removePeer} />
  );
};

/**
 * Component for displaying a list of connected dApps.
 *
 * Each {@link PeerRow} contains info about a single dApp & delete button.
 *
 * @param peerInfos - peerInfo provided by beacon Api + computed dAppId.
 * @param removePeer - hook for deleting dApp connections.
 */
const PeersDisplay = ({
  peerInfos,
  removePeer,
}: {
  peerInfos: ExtendedPeerInfo[];
  removePeer: (peer: ExtendedPeerInfo) => void;
}) => (
  <Box>
    {peerInfos.map(peerInfo => (
      <Fragment key={peerInfo.senderId}>
        <Divider />
        <PeerRow onRemove={() => removePeer(peerInfo)} peerInfo={peerInfo} />
      </Fragment>
    ))}
  </Box>
);

/**
 * Component for displaying info about single connected dApp.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 * @param onRemove - action for deleting dApp connection.
 */
const PeerRow = ({ peerInfo, onRemove }: { peerInfo: ExtendedPeerInfo; onRemove: () => void }) => (
  <Flex justifyContent="space-between" height="106px" data-testid="peer-row" paddingY="30px">
    <Flex>
      <AspectRatio width="48px" marginRight="16px" ratio={1}>
        <Image width="100%" src={peerInfo.icon} />
      </AspectRatio>
      <Center alignItems="flex-start" flexDirection="column">
        <Heading marginBottom="6px" size="md">
          {peerInfo.name}
        </Heading>
        <StoredPeerInfo peerInfo={peerInfo} />
      </Center>
    </Flex>
    <Center>
      <IconButton
        aria-label="Remove Peer"
        icon={<TrashIcon />}
        onClick={onRemove}
        size="xs"
        variant="circle"
      />
    </Center>
  </Flex>
);

/**
 * Component for displaying additional info about connection with a dApp.
 *
 * Displays {@link AddressPill} with a connected account and network type,
 * if information about the connection is stored in {@link beaconSlice}.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 */
const StoredPeerInfo = ({ peerInfo }: { peerInfo: ExtendedPeerInfo }) => {
  const connectionInfo = useGetConnectionInfo(peerInfo.senderId);

  if (!connectionInfo) {
    return null;
  }
  return (
    <Flex>
      <AddressPill marginRight="10px" address={parsePkh(connectionInfo.accountPkh)} />
      <Divider marginRight="10px" orientation="vertical" />
      <Text marginTop="2px" marginRight="4px" color={colors.gray[450]} fontWeight={650} size="sm">
        Network:
      </Text>
      <Text marginTop="2px" color={colors.white} data-testid="dapp-connection-network" size="sm">
        {capitalize(connectionInfo.networkType)}
      </Text>
    </Flex>
  );
};
