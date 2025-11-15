"use client";

import Image from "next/image";
import { useState } from "react";

type Portrait = {
  id: number;
  src: string;
  height: number;
};

const portraits: Portrait[] = [
  { id: 1, src: "/people/1.png", height: 280 },
  { id: 2, src: "/people/2.png", height: 320 },
  { id: 3, src: "/people/3.png", height: 240 },
  { id: 4, src: "/people/4.png", height: 300 },
  { id: 5, src: "/people/5.png", height: 260 },
  { id: 6, src: "/people/6.png", height: 290 },
];

const MasonryColumn = ({ items }: { items: Portrait[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="pointer-events-none flex h-full flex-col justify-center gap-1 lg:gap-2">
      {items.map((portrait, index) => {
        const isHovered = hoveredIndex === index;
        return (
          <div
            className="group pointer-events-auto relative w-[120px] shrink-0 cursor-pointer overflow-hidden transition-all duration-300 md:w-[140px] lg:w-[160px]"
            key={`${portrait.id}-${index}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            role="button"
            style={{ height: `${portrait.height * 0.7}px` }}
            tabIndex={0}
          >
            <div
              className="relative size-full transition-all duration-500 ease-out will-change-[transform,filter,opacity]"
              style={{
                filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                opacity: isHovered ? 1 : 0.4,
              }}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 120px, (max-width: 1024px) 140px, 160px"
                src={portrait.src}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ScatteredPortraits = () => {
  const leftColumn1 = [portraits[0], portraits[3], portraits[5]];
  const leftColumn2 = [portraits[2], portraits[4], portraits[1]];
  const leftColumn3 = [portraits[1], portraits[5], portraits[3]];
  const rightColumn1 = [portraits[1], portraits[4], portraits[2]];
  const rightColumn2 = [portraits[3], portraits[0], portraits[5]];
  const rightColumn3 = [portraits[2], portraits[4], portraits[0]];

  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 z-1 hidden h-full [@media(min-width:1260px)]:flex">
        <div className="flex h-full gap-2 pl-6 md:pl-8 lg:pl-12">
          <MasonryColumn items={leftColumn1} />
          <div className="pointer-events-none hidden [@media(min-width:1590px)]:block">
            <MasonryColumn items={leftColumn2} />
          </div>
          <div className="pointer-events-none hidden [@media(min-width:1920px)]:block">
            <MasonryColumn items={leftColumn3} />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 right-0 z-1 hidden h-full [@media(min-width:1260px)]:flex">
        <div className="flex h-full gap-2 pr-6 md:pr-8 lg:pr-12">
          <div className="pointer-events-none hidden [@media(min-width:1920px)]:block">
            <MasonryColumn items={rightColumn1} />
          </div>
          <div className="pointer-events-none hidden [@media(min-width:1590px)]:block">
            <MasonryColumn items={rightColumn2} />
          </div>
          <MasonryColumn items={rightColumn3} />
        </div>
      </div>
    </>
  );
};
