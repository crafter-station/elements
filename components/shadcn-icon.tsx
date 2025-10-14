interface ShadcnIconProps {
  className?: string;
}

export function ShadcnIcon({ className = "w-4 h-4" }: ShadcnIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
    >
      <title>Shadcn Icon</title>
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="25"
        strokeLinecap="round"
        d="M208 128l-80 80M192 40L40 192"
      />
    </svg>
  );
}
