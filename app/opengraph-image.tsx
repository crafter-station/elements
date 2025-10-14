import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Elements - Full Stack Components by Railly Hugo";
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
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          {/* Logo pixel block */}
          <div
            style={{
              width: "140px",
              height: "140px",
              backgroundColor: "#fff",
              border: "4px solid #666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              fontWeight: 900,
              color: "#000",
              fontFamily: "monospace",
            }}
          >
            E
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.05em",
              fontFamily: "monospace",
            }}
          >
            ELEMENTS
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#999",
              textAlign: "center",
              maxWidth: "800px",
              fontFamily: "monospace",
            }}
          >
            Full Stack Components
          </div>

          {/* Pixel divider */}
          <div
            style={{
              width: "400px",
              height: "4px",
              backgroundColor: "#333",
              marginTop: "20px",
            }}
          />

          {/* Author */}
          <div
            style={{
              fontSize: 24,
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            by Railly Hugo
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
