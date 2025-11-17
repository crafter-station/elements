import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Browse Elements";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          {/* Icon */}
          <div
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#fff",
              border: "4px solid #666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 900,
              color: "#000",
              fontFamily: "monospace",
            }}
          >
            📦
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
              Browse Elements
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#999",
                fontFamily: "monospace",
              }}
            >
              Production-ready • React • TypeScript
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
            Organized by provider • Easy to install
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
