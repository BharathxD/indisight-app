"use client";

import { Globe } from "@/components/ui/globe";
import { siteConfig } from "@/lib/config";

export const ContactGlobe = () => (
  <div className="relative mx-auto flex aspect-square w-full max-w-[600px] items-center justify-center">
    <Globe
      className="top-0"
      config={{
        width: 800,
        height: 800,
        onRender: () => {
          // No-op callback required by cobe
        },
        devicePixelRatio: 2,
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16_000,
        mapBrightness: 6,
        baseColor: [0.9, 0.9, 0.9],
        markerColor: [0.1, 0.1, 0.1],
        glowColor: [0.9, 0.9, 0.9],
        markers: siteConfig.locations.map((loc) => ({
          location: [loc.lat, loc.lng],
          size: 0.08,
        })),
      }}
    />
  </div>
);
