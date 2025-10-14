import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Brand Logos - Elements";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Featured logo components
const ClerkLogoSmall = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
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

const GitHubLogoSmall = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
    aria-label="GitHub"
  >
    <path
      fill="#fff"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
    />
  </svg>
);

const OpenAILogoSmall = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
    aria-label="OpenAI"
  >
    <path
      fill="#fff"
      d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
    />
  </svg>
);

const StripeLogoSmall = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="60"
    aria-label="Stripe"
  >
    <path
      fill="#fff"
      d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"
    />
  </svg>
);

export default async function Image() {
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
          {/* Icon grid - pixel style with actual logos */}
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#000",
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClerkLogoSmall />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#000",
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitHubLogoSmall />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#000",
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <OpenAILogoSmall />
            </div>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#000",
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StripeLogoSmall />
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.05em",
                fontFamily: "monospace",
              }}
            >
              Brand Logos
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#999",
                fontFamily: "monospace",
              }}
            >
              Tech company logos • Easy to install
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: "#ccc",
              maxWidth: "800px",
              lineHeight: 1.4,
              fontFamily: "monospace",
            }}
          >
            Authentication • Payments • AI • Development Tools
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
