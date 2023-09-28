import { Icon, IconProps } from "@chakra-ui/react";

const BakerIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      data-testid="baker-icon"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.74946 5.25V8.25M7.49946 1.5V4.5M13.4995 12V15M2.24946 6.75H5.24946M5.99946 3H8.99946M11.9995 13.5H14.9995M10.4995 5.25L12.6208 7.37132M14.6369 2.80959L15.0612 3.23385C15.3582 3.53086 15.5067 3.67937 15.5624 3.85062C15.6113 4.00125 15.6113 4.16351 15.5624 4.31414C15.5067 4.48539 15.3582 4.6339 15.0612 4.93091L4.89356 15.0985C4.59655 15.3955 4.44804 15.5441 4.2768 15.5997C4.12617 15.6486 3.9639 15.6486 3.81327 15.5997C3.64203 15.5441 3.49352 15.3955 3.19651 15.0985L2.77224 14.6743C2.47523 14.3773 2.32672 14.2288 2.27108 14.0575C2.22214 13.9069 2.22214 13.7446 2.27108 13.594C2.32672 13.4227 2.47523 13.2742 2.77224 12.9772L12.9399 2.80959C13.2369 2.51258 13.3854 2.36407 13.5566 2.30843C13.7073 2.25948 13.8695 2.25948 14.0202 2.30843C14.1914 2.36407 14.3399 2.51258 14.6369 2.80959Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default BakerIcon;
