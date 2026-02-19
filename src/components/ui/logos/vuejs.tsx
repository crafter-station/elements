interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#4FC08D",
  light: "#4FC08D",
};

export function VuejsLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Vue.js</title>
      <path
        fill={color}
        d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78ZM12 14.08 5.16 2.23h4.43L12 6.41l2.41-4.18h4.43Z"
      />
    </svg>
  );
}
