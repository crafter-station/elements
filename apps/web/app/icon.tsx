import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      {/* Pixel art E logo - 3x3 grid of blocks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {/* Row 1 */}
        <div style={{ display: "flex", gap: "2px" }}>
          <div style={{ width: 8, height: 8, background: "#fff" }} />
          <div style={{ width: 8, height: 8, background: "#fff" }} />
          <div style={{ width: 8, height: 8, background: "#fff" }} />
        </div>
        {/* Row 2 */}
        <div style={{ display: "flex", gap: "2px" }}>
          <div style={{ width: 8, height: 8, background: "#fff" }} />
          <div style={{ width: 8, height: 8, background: "#fff" }} />
          <div style={{ width: 8, height: 8, background: "transparent" }} />
        </div>
        {/* Row 3 */}
        <div style={{ display: "flex", gap: "2px" }}>
          <div style={{ width: 8, height: 8, background: "#fff" }} />
          <div style={{ width: 8, height: 8, background: "#fff" }} />
          <div style={{ width: 8, height: 8, background: "#fff" }} />
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
