export function TriggerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="109"
      height="95"
      viewBox="0 0 109 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Trigger Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.569 38.1914L54.5301 0.158447L108.956 94.4175H0.104248L22.0654 56.3834L37.6003 65.3517L31.1753 76.4795H77.885L54.5301 36.0332L48.1051 47.1609L32.569 38.1914Z"
        fill="url(#paint0_linear_light)"
        className="dark:fill-[url(#paint0_linear_dark)]"
      />
      <defs>
        {/* Light mode gradient - purple to violet */}
        <linearGradient
          id="paint0_linear_light"
          x1="88.2367"
          y1="94.4175"
          x2="87.2207"
          y2="27.8737"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        {/* Dark mode gradient - green to yellow-green */}
        <linearGradient
          id="paint0_linear_dark"
          x1="88.2367"
          y1="94.4175"
          x2="87.2207"
          y2="27.8737"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#41FF54" />
          <stop offset="1" stopColor="#E7FF52" />
        </linearGradient>
      </defs>
    </svg>
  );
}
