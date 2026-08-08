import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          border: "2px solid #D4A84B",
          color: "#6B3A2A",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Georgia, 'Times New Roman', serif",
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
