const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function LumaLogo({
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
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fillRule="evenodd"
      >
        <title>Luma</title>
        <path
          d="M12.393 24L2 17.998l10.393-6 10.392 6-10.393 6z"
          fillOpacity=".66"
        ></path>
        <path d="M2 5.999L12.393 0v24L2 18V5.999z" fillOpacity=".66"></path>
      </svg>
    );
  }

  if (variant === "icon-color") {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>Luma</title>
        <path d="M2 5.999L12.392 0v24L2 18V5.999z" fill="#000"></path>
        <path
          d="M12.392 24L2 18l10.392-6 10.393 6-10.393 6z"
          fill="url(#lobe-icons-luma-fill-0)"
        ></path>
        <path
          d="M12.392 24L2 18l10.392-6 10.393 6-10.393 6z"
          fill="url(#lobe-icons-luma-fill-1)"
        ></path>
        <path
          d="M2 5.999L12.392 0v24L2 18V5.999z"
          fill="url(#lobe-icons-luma-fill-2)"
          style="mix-blend-mode:screen"
        ></path>
        <path
          d="M12.392 24L2 18l10.392-6 10.393 6-10.393 6z"
          fill="url(#lobe-icons-luma-fill-3)"
          style="mix-blend-mode:overlay"
        ></path>
        <path
          d="M2 5.999L12.392 0v24L2 18V5.999z"
          fill="url(#lobe-icons-luma-fill-4)"
          style="mix-blend-mode:overlay"
        ></path>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="lobe-icons-luma-fill-0"
            x1="2"
            x2="22.785"
            y1="18"
            y2="18"
          >
            <stop stopColor="#00A"></stop>
            <stop offset="1" stopColor="#A78DFF"></stop>
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="lobe-icons-luma-fill-1"
            x1="2"
            x2="22.785"
            y1="18"
            y2="18"
          >
            <stop stopColor="#00A"></stop>
            <stop offset="1" stopColor="#A78DFF"></stop>
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="lobe-icons-luma-fill-2"
            x1="13.748"
            x2="4.672"
            y1="22.642"
            y2="3.745"
          >
            <stop stopColor="#004EFF"></stop>
            <stop offset="1" stopColor="#0FF"></stop>
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="lobe-icons-luma-fill-3"
            x1="2"
            x2="22.785"
            y1="18"
            y2="18"
          >
            <stop stopColor="#00A"></stop>
            <stop offset="1" stopColor="#A78DFF"></stop>
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="lobe-icons-luma-fill-4"
            x1="13.748"
            x2="4.672"
            y1="22.642"
            y2="3.745"
          >
            <stop stopColor="#004EFF"></stop>
            <stop offset="1" stopColor="#0FF"></stop>
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 111 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fillRule="evenodd"
    >
      <title>Luma</title>
      <path d="M2 2h2.314v17.355h8.926v2.15H2V2zm28.402 12.066c0 1.065-.137 2.075-.413 3.03-.257.956-.68 1.8-1.267 2.535-.57.716-1.323 1.295-2.26 1.735-.936.423-2.074.634-3.415.634-1.34 0-2.48-.211-3.416-.634-.937-.44-1.699-1.019-2.287-1.735a7.47 7.47 0 01-1.267-2.535 11.616 11.616 0 01-.386-3.03V2h2.315v11.736c0 .79.082 1.551.247 2.286.166.735.441 1.387.827 1.956.386.57.9 1.028 1.543 1.377.642.331 1.45.496 2.424.496.973 0 1.781-.165 2.424-.496a4.311 4.311 0 001.543-1.377 5.67 5.67 0 00.826-1.956c.166-.735.248-1.497.248-2.286V2h2.314v12.066zM35.171 2h3.443l6.612 15.29h.055L51.948 2h3.36v19.504h-2.313V5.14h-.056l-6.997 16.364h-1.405L37.54 5.14h-.055v16.364H35.17V2zm31.328 0h2.177l8.292 19.504h-2.7l-1.983-4.793h-9.752l-2.011 4.793h-2.618L66.5 2zm1.047 2.975h-.055l-4.05 9.587h7.962l-3.857-9.587zM93.563 2h2.177l8.292 19.504h-2.7l-1.983-4.793h-9.753l-2.01 4.793h-2.618L93.563 2zm1.047 2.975h-.055l-4.05 9.587h7.962L94.61 4.975zM106.624 2h2.314v19.504h-2.314V2z"></path>
    </svg>
  );
}
