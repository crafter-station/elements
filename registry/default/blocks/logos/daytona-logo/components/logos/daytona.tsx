interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#0A0A0A",
};

export function DaytonaLogo({
  className,
  variant: _variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="195 136 65 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Daytona</title>
      <path d="M195.994 172.235h24.929v8.547h-24.929z" fill={color} />
      <path d="M229.471 142.32h28.491v8.547h-28.491z" fill={color} />
      <path
        d="M214.513 144.954l21.153-21.153 6.044 6.044-21.153 21.153z"
        fill={color}
      />
      <path
        d="M214.644 166.322l-16.246-16.246-6.043 6.044 16.245 16.246z"
        fill={color}
      />
      <path
        d="M236.012 178.279l-17.124 17.124-6.044-6.044 17.124-17.124z"
        fill={color}
      />
      <path
        d="M235.881 156.911l19.139 19.139 6.043-6.044-19.138-19.139z"
        fill={color}
      />
      <path d="M214.513 135.909v20.656h-8.547v-20.656z" fill={color} />
      <path d="M244.428 165.825v25.642h-8.547v-25.642z" fill={color} />
    </svg>
  );
}
