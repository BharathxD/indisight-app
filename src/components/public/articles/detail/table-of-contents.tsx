"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/editor-utils";

type TableOfContentsProps = {
  headings: Heading[];
};

export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -66%" }
    );

    const headingElements = headings.map((heading) =>
      document.getElementById(heading.id)
    );

    for (const element of headingElements) {
      if (element) observer.observe(element);
    }

    return () => {
      for (const element of headingElements) {
        if (element) observer.unobserve(element);
      }
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
      <h3 className="mb-4 font-semibold text-[0.8125rem] text-muted-foreground uppercase tracking-wider">
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, i) => (
            <li
              className={heading.level === 3 && i !== 0 ? "pl-4" : ""}
              key={heading.id}
            >
              <a
                className={`block text-[0.875rem] leading-tight transition-colors ${
                  activeId === heading.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
