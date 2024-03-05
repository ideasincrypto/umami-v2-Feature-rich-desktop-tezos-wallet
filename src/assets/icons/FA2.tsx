import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const FA2Icon: React.FC<IconProps> = props => (
  <Icon
    width="23px"
    height="18px"
    fill={colors.gray[450]}
    viewBox="0 0 23 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M1.0261 13V4.27273H6.80451V5.79403H2.87127V7.87358H6.42099V9.39489H2.87127V13H1.0261ZM8.46005 13H6.48278L9.49556 4.27273H11.8734L14.8819 13H12.9047L10.7186 6.26705H10.6504L8.46005 13ZM8.33647 9.5696H13.0069V11.0099H8.33647V9.5696ZM15.8812 13V11.6705L18.9877 8.79403C19.252 8.53835 19.4735 8.30824 19.6525 8.10369C19.8343 7.89915 19.9721 7.69886 20.0659 7.50284C20.1596 7.30398 20.2065 7.08949 20.2065 6.85938C20.2065 6.60369 20.1483 6.38352 20.0318 6.19886C19.9153 6.01136 19.7562 5.8679 19.5545 5.76847C19.3528 5.66619 19.1241 5.61506 18.8684 5.61506C18.6014 5.61506 18.3684 5.66903 18.1696 5.77699C17.9707 5.88494 17.8173 6.03977 17.7093 6.24148C17.6014 6.44318 17.5474 6.68324 17.5474 6.96165H15.796C15.796 6.39062 15.9252 5.89489 16.1838 5.47443C16.4423 5.05398 16.8045 4.72869 17.2704 4.49858C17.7363 4.26847 18.2733 4.15341 18.8812 4.15341C19.5062 4.15341 20.0502 4.2642 20.5133 4.4858C20.9792 4.70455 21.3414 5.00852 21.6 5.39773C21.8585 5.78693 21.9877 6.23295 21.9877 6.7358C21.9877 7.06534 21.9224 7.39062 21.7917 7.71165C21.6639 8.03267 21.4352 8.3892 21.1056 8.78125C20.7761 9.17045 20.3116 9.63778 19.7122 10.1832L18.438 11.4318V11.4915H22.1028V13H15.8812Z" />
  </Icon>
);
