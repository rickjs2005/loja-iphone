import { ImageResponse } from "next/og";
import { storeConfig } from "@/config/theme.config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon de marca (acento do tenant) gerado dinamicamente. */
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
          background: storeConfig.colors.primary,
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 800,
          borderRadius: 7,
          fontFamily: "sans-serif",
        }}
      >
        i
      </div>
    ),
    { ...size },
  );
}
