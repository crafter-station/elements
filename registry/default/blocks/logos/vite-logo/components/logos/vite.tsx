interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#646CFF",
  light: "#646CFF",
};

export function ViteLogo({
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
      <title>Vite</title>
      <path
        fill={color}
        d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.46 13.056a.306.306 0 0 1-.582-.108l1.104-5.346a.306.306 0 0 0-.37-.36l-2.37.544a.306.306 0 0 1-.364-.427zm14.976-7.927L17.284 3.74a.61.61 0 0 0-.536.593l-.228 5.862a.61.61 0 0 0 .725.596l2.006-.461a.61.61 0 0 1 .665.876L14.724 21.22a.61.61 0 0 1-1.139-.326l1.13-5.476a.61.61 0 0 0-.74-.72l-2.443.562a.61.61 0 0 1-.727-.854L14.9.926a.61.61 0 0 1 .549-.394l7.508-.17a.61.61 0 0 1 .305 1.09z"
      />
    </svg>
  );
}
