import { Icon, IconProps } from "@chakra-ui/react";

export const GoogleIcon: React.FC<IconProps> = props => (
  <Icon
    width="24px"
    height="24px"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path // blue
      d="M23.5198 12.2729C23.5198 11.422 23.4435 10.6038 23.3016 9.81836H12V14.4601H18.4581C18.1799 15.9601 17.3345 17.231 16.0636 18.0819V21.0927H19.9417C22.2107 19.0037 23.5198 15.9274 23.5198 12.2729Z"
      fill="#4285F4"
      clipRule="evenodd"
      fillRule="evenodd"
    />
    <path // green
      d="M12.0008 24.0011C15.2408 24.0011 17.9571 22.9266 19.9425 21.0939L16.0644 18.083C14.9899 18.803 13.6153 19.2284 12.0008 19.2284C8.8754 19.2284 6.22999 17.1176 5.28637 14.2812H1.27734V17.3903C3.25186 21.312 7.30997 24.0011 12.0008 24.0011Z"
      fill="#34A853"
      clipRule="evenodd"
      fillRule="evenodd"
    />
    <path // yellow
      d="M5.28537 14.2803C5.04537 13.5603 4.90901 12.7912 4.90901 12.0003C4.90901 11.2094 5.04537 10.4404 5.28537 9.72037V6.61133H1.27634C0.463629 8.2313 0 10.064 0 12.0003C0 13.9367 0.463629 15.7694 1.27634 17.3893L5.28537 14.2803Z"
      fill="#FBBC05"
      clipRule="evenodd"
      fillRule="evenodd"
    />
    <path // red
      d="M12.0008 4.77265C13.7626 4.77265 15.3444 5.3781 16.588 6.56717L20.0298 3.1254C17.9516 1.18907 15.2353 0 12.0008 0C7.30997 0 3.25186 2.68905 1.27734 6.6108L5.28637 9.71984C6.22999 6.88353 8.8754 4.77265 12.0008 4.77265Z"
      fill="#EA4335"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  </Icon>
);
