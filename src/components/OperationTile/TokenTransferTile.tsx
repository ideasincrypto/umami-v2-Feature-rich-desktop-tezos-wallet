import { AspectRatio, Box, Center, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import colors from "../../style/colors";
import { Token, thumbnailUri, tokenNameSafe, tokenPrettyAmount } from "../../types/Token";
import { TokenTransfer } from "../../types/Transfer";
import { useIsOwnedAddress } from "../../utils/hooks/setAccountDataHooks";
import { TransactionOperation } from "../../utils/tezos";
import { useShowAddress } from "./useShowAddress";
import { TzktLink } from "./TzktLink";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { Fee } from "./Fee";
import { Timestamp } from "./Timestamp";
import AddressPill from "../AddressPill/AddressPill";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { OperationStatus } from "./OperationStatus";
import { TzktAlias } from "../../types/Address";

export const TokenTransferTile: React.FC<{
  // externally originated token transfers
  // do not have a corresponding operation in the list
  // in fact, they might not even have a corresponding transaction
  // they might be initiated by a contract origination instead
  operation?: TransactionOperation;
  tokenTransfer: TokenTransfer;
  token: Token;
}> = ({ operation, tokenTransfer, token }) => {
  const rawAmount = tokenTransfer.amount;

  const showToAddress = useShowAddress(tokenTransfer.to.address);
  const showFromAddress = useShowAddress(tokenTransfer.from?.address || "");
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  const isOutgoing = useIsOwnedAddress(tokenTransfer.from?.address || "");
  const isNFT = token.type === "nft";

  const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });
  const titleColor = isOutgoing ? colors.orange : colors.green;
  const underlineColor = isNFT ? "white" : titleColor;
  const sign = isOutgoing ? "-" : "+";

  const titleElement = isNFT ? (
    <Tooltip
      bg={colors.gray[700]}
      border="1px solid"
      borderColor={colors.gray[500]}
      borderRadius="8px"
      data-testid="nft-tooltip"
      p="8px"
      label={
        <AspectRatio w="170px" h="170px" ratio={1}>
          <Image src={getIPFSurl(thumbnailUri(token))} />
        </AspectRatio>
      }
    >
      <Flex>
        <TzktLink
          transactionId={tokenTransfer.transactionId}
          originationId={tokenTransfer.originationId}
          migrationId={tokenTransfer.migrationId}
          mr="8px"
          data-testid="title"
          color={underlineColor}
        >
          <Text display="inline" fontWeight="600" color={titleColor}>
            {sign}
            {tokenAmount}
          </Text>
          <Text display="inline" fontWeight="600">
            {" "}
            {tokenNameSafe(token)}
          </Text>
        </TzktLink>
      </Flex>
    </Tooltip>
  ) : (
    <TzktLink
      transactionId={tokenTransfer.transactionId}
      originationId={tokenTransfer.originationId}
      migrationId={tokenTransfer.migrationId}
      mr="8px"
      data-testid="title"
      color={underlineColor}
    >
      <Text display="inline" fontWeight="600" color={titleColor}>
        {sign}
        {tokenAmount}
      </Text>
    </TzktLink>
  );

  return (
    <Flex direction="column" data-testid="operation-tile-token-transfer" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <TransactionDirectionIcon isOutgoing={isOutgoing} mr="8px" />
          {titleElement}
          {operation && <Fee operation={operation} />}
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={tokenTransfer.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            {(showToAddress || showAnyAddress) && (
              <Flex mr="15px" data-testid="to">
                <Text mr="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={tokenTransfer.to} />
              </Flex>
            )}
            {showFromAddress && (
              <Flex data-testid="from">
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={tokenTransfer.from as TzktAlias} />
              </Flex>
            )}
          </Flex>
          <Center>
            <OperationTypeWrapper>Token Transfer</OperationTypeWrapper>
            <OperationStatus level={tokenTransfer.level} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
