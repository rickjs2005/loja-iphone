"use client";

import dynamic from "next/dynamic";
import { IphoneRender } from "@/components/visual/iphone-render";

/**
 * Carrega o Canvas 3D apenas no cliente (ssr:false) — o Three.js não roda no
 * servidor. Enquanto baixa, mostra o render SVG para não deixar buraco.
 */
export const Iphone3DLazy = dynamic(
  () => import("./iphone-3d").then((m) => m.Iphone3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center p-6">
        <div className="h-full w-auto opacity-80">
          <IphoneRender uid="hero-fallback" colorway="natural" />
        </div>
      </div>
    ),
  },
);
