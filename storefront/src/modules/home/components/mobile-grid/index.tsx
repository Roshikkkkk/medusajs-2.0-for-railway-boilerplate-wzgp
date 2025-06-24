"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";
import { HttpTypes } from "@medusajs/types";

type MobileGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
};

const gridItems = Array.from({ length: 12 }, (_, i) => ({
  id: `grid-item-${i + 1}`,
}));

export default function MobileGrid({ className, collections }: MobileGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number } | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const collectionTitles = useMemo(() => {
    return collections
      ? collections.map((col) => ({
          id: col.id,
          title: col.title || "Untitled",
        }))
      : [];
  }, [collections]);

  useEffect(() => {
    if (collectionTitles.length > 0) {
      setActiveCategory(collectionTitles[0].id);
    }
  }, [collectionTitles]);

  const updateUnderline = () => {
    if (!activeCategory || !containerRef.current) return;
    const btn = buttonsRef.current[activeCategory];
    if (!btn) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setUnderlineStyle({
      left: btnRect.left - containerRect.left + containerRef.current.scrollLeft,
      width: btnRect.width,
    });
  };

  const scrollToCenterButton = () => {
    if (!activeCategory || !containerRef.current) return;
    const btn = buttonsRef.current[activeCategory];
    if (!btn) return;

    const container = containerRef.current;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const btnCenter = btnRect.left + btnRect.width / 2;
    const containerCenter = containerRect.width / 2;
    const scrollLeft = btnCenter - containerCenter + container.scrollLeft - btnRect.width / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateUnderline();
    scrollToCenterButton();
  }, [activeCategory]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = () => updateUnderline();

    container.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);

    return () => {
      container.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [activeCategory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveCategory(id);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, id: string) => {
    if (pointerStart.current) {
      const distanceX = Math.abs(e.clientX - pointerStart.current.x);
      const distanceY = Math.abs(e.clientY - pointerStart.current.y);

      if (distanceX < 10 && distanceY < 10) {
        setActiveCategory(id);
      }
    }
    pointerStart.current = null;
  };

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(12);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      className={clx(
        "w-full pt-0 pb-4 bg-white border-t border-gray-200 mt-4",
        className
      )}
    >
      <div
        ref={containerRef}
        className="relative flex overflow-x-auto no-scrollbar px-4 py-2"
        style={{ userSelect: "none" }}
        role="tablist"
      >
        {collectionTitles.length > 0 ? (
          collectionTitles.map((col) => (
            <button
              key={col.id}
              ref={(el) => (buttonsRef.current[col.id] = el)}
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, col.id)}
              onKeyDown={(e) => handleKeyDown(e, col.id)}
              className={clx(
                "flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-300 rounded-md",
                activeCategory === col.id
                  ? "text-[#007AFF] font-semibold bg-blue-50"
                  : "text-gray-500"
              )}
              type="button"
              role="tab"
              aria-selected={activeCategory === col.id}
              tabIndex={activeCategory === col.id ? 0 : -1}
            >
              {col.title}
            </button>
          ))
        ) : (
          <span className="text-sm text-gray-500 px-4 py-2">No collections found</span>
        )}
        {underlineStyle && (
          <div
            className="absolute bottom-0 h-[3px] bg-[#007AFF] rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width,
            }}
          />
        )}
      </div>

      <div
        className="grid grid-cols-2 w-full overflow-hidden transition-all duration-500 border-t border-gray-200"
        style={{ maxHeight: visibleCount === 6 ? "900px" : "1800px" }}
      >
        {gridItems.slice(0, visibleCount).map((item, index) => (
          <div
            key={item.id}
            className={clx(
              "transition-opacity duration-500",
              index >= 6 && visibleCount === 6 ? "opacity-0" : "opacity-100"
            )}
          >
            <MobileCard index={index} />
          </div>
        ))}
      </div>

      {visibleCount < gridItems.length && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleShowMore}
            disabled={isLoading}
            className={clx(
              "h-12 px-6 bg-[#007AFF] text-white rounded-full text-sm font-medium",
              "hover:bg-[#0051CC] transition-all duration-300 inline-flex items-center justify-center",
              isLoading ? "opacity-75 cursor-not-allowed w-[180px]" : "w-[150px] hover:shadow-md"
            )}
            aria-label="Показати ще"
            type="button"
          >
            <span>{isLoading ? "Зачекайте" : "Показати ще"}</span>
            {isLoading && (
              <svg
                className="ml-2 w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}