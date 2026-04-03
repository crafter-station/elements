const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

const ICON_PATH =
  "M89.7 93.7c4.667 3.5 11.667 1.167 5.25-5.25C75.7 69.778 79.783 18.445 55.866 18.445S36.033 69.778 16.783 88.445c-7 7-.417 8.75 4.25 5.25 18.083-12.25 16.916-33.834 33.833-33.834s16.834 21.584 34.834 33.834z";

function GradientDef({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id={id}
        x1="16"
        y1="18"
        x2="96"
        y2="18"
      >
        <stop offset="0" stopColor="#00B95C" />
        <stop offset="0.35" stopColor="#FBBC04" />
        <stop offset="0.65" stopColor="#FC413D" />
        <stop offset="1" stopColor="#3186FF" />
      </linearGradient>
    </defs>
  );
}

export function AntigravityLogo({
  className,
  variant = "icon",
  mode = "dark",
}: {
  className?: string;
  variant?: "icon" | "icon-color";
  mode?: "dark" | "light";
}) {
  const color = COLORS[mode];

  if (variant === "icon") {
    return (
      <svg
        role="img"
        viewBox="0 0 112 112"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
      >
        <title>Antigravity</title>
        <path d={ICON_PATH} fill={color} />
      </svg>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 112 112"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <title>Antigravity</title>
      <GradientDef id="antigravity-gradient" />
      <path d={ICON_PATH} fill="url(#antigravity-gradient)" />
    </svg>
  );
}
