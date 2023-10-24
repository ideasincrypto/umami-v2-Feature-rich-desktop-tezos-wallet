import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const DoubleCheckmarkIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={colors.gray[450]}
      {...props}
    >
      <path
        d="M4 14L9 19L20 8M6 8.88889L9.07692 12L16 5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default DoubleCheckmarkIcon;