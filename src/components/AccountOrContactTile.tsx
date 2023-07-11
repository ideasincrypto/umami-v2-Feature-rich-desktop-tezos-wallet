import { MdPersonAddAlt } from "react-icons/md";
import { FC } from "react";
import { useUpsertContactModal } from "../views/home/useUpsertContactModal";
import { formatPkh, truncate } from "../utils/format";
import { useGetContactName } from "../utils/hooks/contactsHooks";
import { useGetImplicitAccount } from "../utils/hooks/accountHooks";
import { Box, Text } from "@chakra-ui/react";
import { IconAndTextBtn } from "./IconAndTextBtn";

export const ContactTile: FC<{
  pkh: string;
  contactName: string | undefined;
}> = ({ pkh, contactName }) => {
  const { modalElement, onOpen } = useUpsertContactModal();

  return (
    <Box data-testid="contact-tile">
      {contactName ? (
        <Text size="sm">{truncate(contactName, 20)}</Text>
      ) : (
        <IconAndTextBtn
          label={formatPkh(pkh)}
          icon={MdPersonAddAlt}
          onClick={() => {
            onOpen({
              title: "Add Contact",
              buttonText: "Add to Contact",
              contact: { name: "", pkh },
            });
          }}
          textFirst
        />
      )}

      {modalElement}
    </Box>
  );
};

const AccountOrContactTile: React.FC<{ pkh: string }> = ({ pkh }) => {
  const getContactName = useGetContactName();
  const getAccount = useGetImplicitAccount();

  const account = getAccount(pkh);

  if (account) {
    return <Text data-testid="account-or-contact-tile">{account.label}</Text>;
  }

  return <ContactTile pkh={pkh} contactName={getContactName(pkh)} />;
};

export default AccountOrContactTile;
