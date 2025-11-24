export function NpmLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      width="256"
      height="256"
      className={className || "w-8 h-8"}
    >
      <title>npm Logo</title>
      <polygon fill="#C12127" points="0 256 0 0 256 0 256 256" />
      <polygon
        fill="#FFFFFF"
        points="48 48 208 48 208 208 176 208 176 80 128 80 128 208 48 208"
      />
    </svg>
  );
}
