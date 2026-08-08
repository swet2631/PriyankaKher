import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#FAF6F0",
          border: "8px solid #D4A84B",
          color: "#6B3A2A",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Georgia, 'Times New Roman', serif",
          boxShadow: "inset 0 0 0 3px #FAF6F0",
        }}
      >
        PK
      </div>
    ),
    {
      ...size,
    }
  );
}
