import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const SlashIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      fill="none"
      stroke={colors.gray[450]}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M16 3L8 21" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
};

export default SlashIcon;
