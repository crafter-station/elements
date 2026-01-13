import { ImageResponse } from "next/og";

import { getProviderMetadata } from "@/lib/registry-loader";

export const runtime = "edge";

export const alt = "Elements - Provider Components";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// SVG Logo Components for JSX rendering
const ClerkLogoSVG = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    aria-label="Clerk"
  >
    <path
      fill="#fff"
      d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
    />
    <path
      fill="#fff"
      fillOpacity=".4"
      d="M18.67 2.023c.375.25.407.78.087 1.098l-2.74 2.74c-.248.248-.632.287-.944.128a6.75 6.75 0 0 0-9.085 9.085c.16.311.121.695-.126.943l-2.74 2.74c-.32.32-.848.288-1.1-.087A11.944 11.944 0 0 1 0 12C0 5.373 5.373 0 12 0c2.468 0 4.762.745 6.67 2.023Z"
    />
    <path
      fill="#fff"
      d="M18.758 20.879c.319.319.287.847-.088 1.098A11.943 11.943 0 0 1 12 24c-2.468 0-4.762-.745-6.67-2.023-.375-.25-.407-.779-.088-1.098l2.74-2.74c.249-.248.633-.287.945-.128A6.72 6.72 0 0 0 12 18.75a6.72 6.72 0 0 0 3.073-.739c.312-.16.696-.12.944.127l2.74 2.74Z"
    />
  </svg>
);

const UploadThingLogoSVG = () => (
  <svg
    role="img"
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 300"
    width="80"
    height="80"
    aria-label="UploadThing"
  >
    <g transform="translate(0,300) scale(0.1,-0.1)" fill="#fff" stroke="none">
      <path d="M2193 2980 c-111 -20 -248 -91 -339 -177 -122 -114 -210 -295 -230 -474 -7 -60 -18 -75 -29 -40 -10 32 -79 134 -121 177 -128 135 -290 206 -469 207 -181 1 -322 -59 -455 -192 -95 -96 -141 -166 -181 -280 -75 -212 -59 -449 42 -647 22 -42 38 -78 37 -79 -2 -1 -23 -13 -48 -25 -153 -77 -278 -226 -343 -405 -72 -203 -58 -444 37 -633 89 -177 213 -288 398 -358 66 -25 86 -28 198 -28 112 0 133 3 200 27 216 79 374 248 445 477 9 30 18 60 20 67 3 8 27 0 71 -22 204 -103 451 -83 640 51 137 97 245 254 290 424 20 72 25 283 11 380 l-9 55 66 13 c223 42 429 232 510 470 163 479 -142 994 -602 1017 -48 2 -110 0 -139 -5z"></path>
    </g>
  </svg>
);

const PolarLogoSVG = () => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    fill="none"
    viewBox="0 0 300 300"
    aria-label="Polar"
  >
    <g clipPath="url(#polar-clip)">
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M66.428 274.26c68.448 46.333 161.497 28.406 207.83-40.041 46.335-68.448 28.408-161.497-40.04-207.83C165.77-19.946 72.721-2.019 26.388 66.428-19.948 134.878-2.02 227.928 66.427 274.26ZM47.956 116.67c-17.119 52.593-11.412 105.223 11.29 139.703C18.04 217.361 7.275 150.307 36.943 92.318c18.971-37.082 50.623-62.924 85.556-73.97-31.909 18.363-59.945 53.466-74.544 98.322Zm127.391 166.467c36.03-10.531 68.864-36.752 88.338-74.815 29.416-57.497 19.083-123.905-21.258-163.055 21.793 34.496 27.046 86.275 10.204 138.02-15.016 46.134-44.246 81.952-77.284 99.85Zm8.28-16.908c24.318-20.811 44.389-55.625 53.309-97.439 14.097-66.097-4.385-127.592-41.824-148.113 19.858 26.718 29.91 78.613 23.712 136.656-4.739 44.391-18.01 83.26-35.197 108.896ZM63.717 131.844c-14.201 66.586 4.66 128.501 42.657 148.561-20.378-26.396-30.777-78.891-24.498-137.694 4.661-43.657 17.574-81.974 34.349-107.614-23.957 20.886-43.687 55.392-52.507 96.747Zm136.117 17.717c1.074 67.912-20.244 123.317-47.612 123.748-27.369.433-50.425-54.27-51.498-122.182-1.073-67.913 20.244-123.318 47.613-123.75 27.368-.432 50.425 54.271 51.497 122.184Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="polar-clip">
        <path fill="#fff" d="M0 0h300v300H0z" />
      </clipPath>
    </defs>
  </svg>
);

const GitHubLogoSVG = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="#fff"
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    aria-label="GitHub"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const SupabaseLogoSVG = () => (
  <svg
    role="img"
    viewBox="0 0 109 113"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    aria-label="Supabase"
  >
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#supabase-paint0)"
    />
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#supabase-paint1)"
      fillOpacity="0.2"
    />
    <path
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
      fill="#3ECF8E"
    />
    <defs>
      <linearGradient
        id="supabase-paint0"
        x1="53.9738"
        y1="54.974"
        x2="94.1635"
        y2="71.8295"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#249361" />
        <stop offset="1" stopColor="#3ECF8E" />
      </linearGradient>
      <linearGradient
        id="supabase-paint1"
        x1="36.1558"
        y1="30.578"
        x2="54.4844"
        y2="65.0806"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// Map providers to their logo components
const providerLogos: Record<string, () => React.ReactElement> = {
  clerk: ClerkLogoSVG,
  uploadthing: UploadThingLogoSVG,
  polar: PolarLogoSVG,
  supabase: SupabaseLogoSVG,
  github: GitHubLogoSVG,
};

export default async function Image({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  const metadata = getProviderMetadata(provider);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        backgroundColor: "#000",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 1px, #111 1px, #111 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, #111 1px, #111 2px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Border frame - pixel art style */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          border: "8px solid #333",
          margin: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "60px",
            gap: "40px",
          }}
        >
          {/* Provider icon area with pixel border */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: metadata.brandColor || "#fff",
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              {providerLogos[provider] ? (
                providerLogos[provider]()
              ) : (
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: "#000",
                  }}
                >
                  {metadata.displayName.charAt(0)}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.05em",
                  fontFamily: "monospace",
                }}
              >
                {metadata.displayName}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#999",
                  fontFamily: "monospace",
                }}
              >
                {metadata.category}
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: "#ccc",
              maxWidth: "900px",
              lineHeight: 1.4,
              fontFamily: "monospace",
            }}
          >
            {metadata.description}
          </div>

          {/* Footer with pixel divider */}
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              paddingTop: "32px",
              borderTop: "4px dashed #333",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 20,
                color: "#666",
                fontFamily: "monospace",
              }}
            >
              Elements by Railly Hugo
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#666",
                fontFamily: "monospace",
              }}
            >
              tryelements.dev
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
