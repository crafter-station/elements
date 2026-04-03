const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

const BRAND_COLOR = "#F34E3F";

const ICON_PATHS = [
  "M3.769 18.302l4.73-4.797 1.72 6.535 2.5-.684-2.49-9.489-9.339-2.529-.665 2.555 6.426 1.746-4.71 4.789 1.828 1.874z",
  "M17.407 12.741l2.5-.683-2.49-9.489-9.339-2.529-.664 2.555 7.885 2.142 2.108 8.004z",
  "M13.818 16.388l2.5-.684-2.49-9.488-9.339-2.53-.664 2.556 7.885 2.142 2.108 8.004z",
];

const TEXT_PATH =
  "M12.95 9.36c0-.67.12-1.24.35-1.72.23-.49.56-.86.97-1.12.42-.26.9-.39 1.46-.39.4 0 .76.08 1.06.24.31.16.55.37.73.64V4.52h1.45v9.36h-1.45v-.92c-.17.27-.42.5-.73.67-.31.17-.68.26-1.1.26-.54 0-1.02-.14-1.44-.41-.41-.27-.74-.65-.97-1.14-.23-.49-.35-1.07-.35-1.72zm4.58 0c0-.43-.08-.81-.24-1.14-.16-.34-.37-.6-.63-.79-.26-.19-.56-.29-.89-.29s-.63.1-.89.29c-.26.19-.47.45-.63.79-.16.33-.24.72-.24 1.14 0 .43.08.81.24 1.14.16.34.37.6.63.79.26.19.56.29.89.29s.63-.1.89-.29c.26-.19.47-.45.63-.79.16-.34.24-.72.24-1.14zM7.25 13.88V8.85h1.45v4.7c0 .51.12.89.36 1.15.24.25.58.38 1.01.38.44 0 .79-.13 1.04-.39.26-.26.39-.65.39-1.15V8.85h1.44v5.03h-1.44v-.77c-.2.28-.44.5-.73.65-.29.15-.62.23-.99.23-.63 0-1.12-.19-1.48-.58-.36-.39-.54-.95-.54-1.68zM2.7 13.88V8.85h1.44v.69c.17-.25.39-.44.66-.58.28-.15.59-.22.93-.22.42 0 .79.1 1.1.3.32.2.57.48.74.84.18.35.27.76.27 1.22v2.78H6.4V11.2c0-.44-.11-.78-.33-1.02-.22-.24-.52-.36-.91-.36-.39 0-.7.12-.93.36-.22.24-.33.58-.33 1.02v2.68H2.46z";

export function AmpLogo({
  className,
  variant = "icon",
  mode = "dark",
}: {
  className?: string;
  variant?: "icon" | "icon-color" | "wordmark";
  mode?: "dark" | "light";
}) {
  const color = COLORS[mode];

  if (variant === "icon") {
    return (
      <svg
        role="img"
        viewBox="0 0 21 21"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
      >
        <title>Amp</title>
        {ICON_PATHS.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </svg>
    );
  }

  if (variant === "icon-color") {
    return (
      <svg
        role="img"
        viewBox="0 0 21 21"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
      >
        <title>Amp</title>
        {ICON_PATHS.map((d, i) => (
          <path key={i} d={d} fill={BRAND_COLOR} />
        ))}
      </svg>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <title>Amp</title>
      {ICON_PATHS.map((d, i) => (
        <path key={i} d={d} fill={BRAND_COLOR} />
      ))}
    </svg>
  );
}
