const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function ReplicateLogo({
  className,
  variant = "icon",
  mode = "dark",
}: {
  className?: string;
  variant?: "icon";
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
        <title>Replicate</title>
        <path d="M22 10.552v2.26h-7.932V22H11.54V10.552H22zM22 2v2.264H4.528V22H2V2h20zm0 4.276V8.54H9.296V22H6.768V6.276H22z"></path>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={color}
    >
      <title>Replicate</title>
      <path d="M22 10.552v2.26h-7.932V22H11.54V10.552H22zM22 2v2.264H4.528V22H2V2h20zm0 4.276V8.54H9.296V22H6.768V6.276H22z"></path>
    </svg>
  );
}
