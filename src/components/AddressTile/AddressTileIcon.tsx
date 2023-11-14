import ContactIcon from "../../assets/icons/Contact";
import UnknownContactIcon from "../../assets/icons/UnknownContact";
import SocialIcon from "../../assets/icons/Social";
import colors from "../../style/colors";
import KeyIcon from "../../assets/icons/Key";
import LedgerIcon from "../../assets/icons/Ledger";
import BakerIcon from "../../assets/icons/Baker";
import { Identicon } from "../Identicon";
import { AddressKind } from "./types";

const baseIconProps = {
  stroke: colors.gray[400],
  borderRadius: "4px",
  p: "5px",
  bg: colors.gray[500],
};

const AddressTileIcon: React.FC<{
  addressKind: AddressKind;
  size?: "md" | "lg";
}> = ({ addressKind, size = "md" }) => {
  const sizeInPx = size === "md" ? "30px" : "38.5px";
  switch (addressKind.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <Identicon p="5px" w={sizeInPx} h={sizeInPx} identiconSize={20} address={addressKind.pkh} />
      );
    case "social":
      return <SocialIcon w={sizeInPx} h={sizeInPx} {...baseIconProps} bg="white" />;
    case "ledger":
      return <LedgerIcon w={sizeInPx} h={sizeInPx} {...baseIconProps} color={colors.gray[400]} />;
    case "multisig":
      return <KeyIcon w={sizeInPx} h={sizeInPx} {...baseIconProps} />;
    case "contact":
      return <ContactIcon w={sizeInPx} h={sizeInPx} {...baseIconProps} />;
    case "unknown":
      return <UnknownContactIcon w={sizeInPx} h={sizeInPx} {...baseIconProps} />;
    case "baker":
      return <BakerIcon w={sizeInPx} h={sizeInPx} {...baseIconProps} />;
  }
};

export default AddressTileIcon;
