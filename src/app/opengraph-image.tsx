import { ImageResponse } from "next/og";
import { storeConfig } from "@/config/theme.config";

export const alt = storeConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de preview ao compartilhar o link (WhatsApp, Instagram, etc.). */
export default function OpengraphImage() {
  const c = storeConfig.colors;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: c.bg,
          color: c.text,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            width: 700,
            height: 500,
            borderRadius: 9999,
            background: c.primary,
            opacity: 0.28,
            filter: "blur(120px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -60,
            width: 520,
            height: 420,
            borderRadius: 9999,
            background: c.accent,
            opacity: 0.25,
            filter: "blur(120px)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          {storeConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 34,
            color: c.muted,
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          iPhones seminovos e lacrados, com garantia e procedencia.
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          {["Pronta entrega", "Garantia", "Envio Brasil"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 9999,
                border: `1px solid ${c.primary}`,
                color: c.primary,
                fontSize: 26,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
