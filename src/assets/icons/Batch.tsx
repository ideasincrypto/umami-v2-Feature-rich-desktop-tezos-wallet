import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const BatchIcon: React.FC<IconProps> = props => (
  <Icon
    width="24px"
    height="24px"
    fill="none"
    strokeWidth="1.2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 4V20M14 4V20M4 8C4 8.92997 4 9.39496 4.10222 9.77646C4.37962 10.8117 5.18827 11.6204 6.22354 11.8978C6.60504 12 7.07003 12 8 12H16C16.93 12 17.395 12 17.7765 11.8978C18.8117 11.6204 19.6204 10.8117 19.8978 9.77646C20 9.39496 20 8.92997 20 8M4 8C4 7.07003 4 6.60504 4.10222 6.22354C4.37962 5.18827 5.18827 4.37962 6.22354 4.10222C6.60504 4 7.07003 4 8 4H16C16.93 4 17.395 4 17.7765 4.10222C18.8117 4.37962 19.6204 5.18827 19.8978 6.22354C20 6.60504 20 7.07003 20 8M4 8V16C4 16.93 4 17.395 4.10222 17.7765C4.37962 18.8117 5.18827 19.6204 6.22354 19.8978C6.60504 20 7.07003 20 8 20H16C16.93 20 17.395 20 17.7765 19.8978C18.8117 19.6204 19.6204 18.8117 19.8978 17.7765C20 17.395 20 16.93 20 16V8M10 16H8C7.07003 16 6.60504 16 6.22354 15.8978C5.18827 15.6204 4.37962 14.8117 4.10222 13.7765C4 13.395 4 12.93 4 12M14 16H16C16.93 16 17.395 16 17.7765 15.8978C18.8117 15.6204 19.6204 14.8117 19.8978 13.7765C20 13.395 20 12.93 20 12M7 8H7.01M17 8H17.01"
      stroke={colors.gray[450]}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
