const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function DifyLogo({
  className,
  variant = "icon",
  mode = "dark",
}: {
  className?: string;
  variant?: "icon" | "icon-color" | "wordmark" | "logo";
  mode?: "dark" | "light";
}) {
  const color = COLORS[mode];

  if (variant === "icon") {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill={color}
        fillRule="evenodd"
      >
        <title>Dify</title>
        <path d="M7.043 6.487c1.635 0 2.241-1.003 2.241-2.243S8.681 2 7.044 2C5.405 2 4.801 3.003 4.801 4.244c0 1.24.604 2.243 2.241 2.243z"></path>
        <path d="M14.883 6.97v1.443h-3.679v3.203h3.68v8.012H8.801V8.41h-8v3.203h4.48v8.012H0v3.203h24v-3.203h-5.6v-8.012H24V8.41h-5.6V5.206H24V2.003h-4.161a4.97 4.97 0 00-4.961 4.967h.005z"></path>
      </svg>
    );
  }

  if (variant === "icon-color") {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>Dify</title>
        <path
          d="M7.043 6.487c1.635 0 2.241-1.003 2.241-2.243S8.681 2 7.044 2C5.405 2 4.801 3.003 4.801 4.244c0 1.24.604 2.243 2.241 2.243z"
          fill="#03F"
        ></path>
        <path
          d="M14.883 6.97v1.443h-3.679v3.203h3.68v8.012H8.801V8.41h-8v3.203h4.48v8.012H0v3.203h24v-3.203h-5.6v-8.012H24V8.41h-5.6V5.206H24V2.003h-4.161a4.97 4.97 0 00-4.961 4.967h.005z"
          fill="#03F"
        ></path>
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg
        role="img"
        viewBox="0 0 53 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill={color}
        fillRule="evenodd"
      >
        <title>Dify</title>
        <path d="M23.834 5.851c1.403 0 1.924-.86 1.924-1.925S25.24 2 23.834 2c-1.405 0-1.923.861-1.923 1.926 0 1.064.518 1.925 1.923 1.925z"></path>
        <path d="M7.837 2.002H2v17.874h5.837c7.209 0 9.269-4.124 9.269-8.938 0-4.814-2.06-8.936-9.27-8.936zm.069 15.125h-2.61V4.752h2.61c4.146 0 5.906 2.037 5.906 6.186s-1.76 6.186-5.906 6.186v.003z"></path>
        <path d="M30.563 6.265v1.239h-3.157v2.75h3.157v6.875h-5.22V7.501H18.48v2.75h3.844v6.876H17.79v2.749h20.597v-2.75h-4.805v-6.875h4.805V7.5h-4.805v-2.75h4.805V2.003h-3.571a4.266 4.266 0 00-4.258 4.263h.005z"></path>
        <path d="M48.177 7.501L45.43 16.44l-2.746-8.938h-3.262l3.983 11.561c.414 1.203-.288 2.189-1.56 2.189h-1.394V24h2.052c1.79 0 3.4-1.134 4.005-2.819l4.93-13.68h-3.262z"></path>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 53 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fillRule="evenodd"
    >
      <title>Dify</title>
      <path d="M23.834 5.851c1.403 0 1.924-.86 1.924-1.925S25.24 2 23.834 2c-1.405 0-1.923.861-1.923 1.926 0 1.064.518 1.925 1.923 1.925z"></path>
      <path d="M7.837 2.002H2v17.874h5.837c7.209 0 9.269-4.124 9.269-8.938 0-4.814-2.06-8.936-9.27-8.936zm.069 15.125h-2.61V4.752h2.61c4.146 0 5.906 2.037 5.906 6.186s-1.76 6.186-5.906 6.186v.003z"></path>
      <path d="M30.563 6.265v1.239h-3.157v2.75h3.157v6.875h-5.22V7.501H18.48v2.75h3.844v6.876H17.79v2.749h20.597v-2.75h-4.805v-6.875h4.805V7.5h-4.805v-2.75h4.805V2.003h-3.571a4.266 4.266 0 00-4.258 4.263h.005z"></path>
      <path d="M48.177 7.501L45.43 16.44l-2.746-8.938h-3.262l3.983 11.561c.414 1.203-.288 2.189-1.56 2.189h-1.394V24h2.052c1.79 0 3.4-1.134 4.005-2.819l4.93-13.68h-3.262z"></path>
    </svg>
  );
}
