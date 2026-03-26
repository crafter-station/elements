interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#18181B",
};

export function BrowserUseLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Browser Use</title>
      <path
        d="M500 100C276.142 100 94.5 281.642 94.5 505.5C94.5 729.358 276.142 911 500 911C723.858 911 905.5 729.358 905.5 505.5C905.5 281.642 723.858 100 500 100ZM500 160C692.254 160 847.5 315.246 847.5 507.5C847.5 699.754 692.254 855 500 855C307.746 855 152.5 699.754 152.5 507.5C152.5 315.246 307.746 160 500 160Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M500 200C322.909 200 179 343.909 179 521C179 698.091 322.909 842 500 842C677.091 842 821 698.091 821 521C821 343.909 677.091 200 500 200ZM500 260C644.133 260 761 376.867 761 521C761 665.133 644.133 782 500 782C355.867 782 239 665.133 239 521C239 376.867 355.867 260 500 260Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        opacity="0.6"
      />
      <path
        d="M500 310C378.497 310 279 409.497 279 531C279 652.503 378.497 752 500 752C621.503 752 721 652.503 721 531C721 409.497 621.503 310 500 310ZM500 370C588.365 370 661 442.635 661 531C661 619.365 588.365 692 500 692C411.635 692 339 619.365 339 531C339 442.635 411.635 370 500 370Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        opacity="0.35"
      />
      <circle cx="500" cy="531" r="60" fill={color} opacity="0.15" />
      <path
        d="M500 471C466.863 471 440 497.863 440 531C440 564.137 466.863 591 500 591C533.137 591 560 564.137 560 531C560 497.863 533.137 471 500 471Z"
        fill={color}
      />
      <path
        d="M94.5 505.5L500 531L820 200"
        stroke={color}
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
