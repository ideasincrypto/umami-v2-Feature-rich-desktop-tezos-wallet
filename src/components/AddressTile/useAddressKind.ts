import { Address } from "../../types/Address";
import { useGetOwnedAccountSafe } from "../../utils/hooks/accountHooks";
import { useGetBaker } from "../../utils/hooks/assetsHooks";
import { useGetContactName } from "../../utils/hooks/contactsHooks";
import { AddressKind, BakerAddress, ContactAddress, OwnedAddreess } from "./types";

const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

export default useAddressKind;

export const useOwnedAccountAddressKind = ({ pkh }: Address): OwnedAddreess | null => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);
  if (!account) {
    return null;
  }

  return {
    type: account.type,
    pkh,
    label: account.label,
  };
};

export const useBakerAddressKind = ({ pkh }: Address): BakerAddress | null => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);
  if (!baker) {
    return null;
  }
  return {
    pkh,
    type: "baker",
    label: baker.name,
  };
};

export const useContactAddressKind = ({ pkh }: Address): ContactAddress | null => {
  const getContactName = useGetContactName();
  const contactName = getContactName(pkh);
  if (!contactName) {
    return null;
  }
  return {
    pkh,
    type: "contact",
    label: contactName,
  };
};
