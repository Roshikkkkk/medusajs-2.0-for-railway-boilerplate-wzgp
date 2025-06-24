"use client";

import { useState } from "react";
import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";

const gridItems = Array.from({ length: 12 }, (_, index) => ({
  id: `grid-item-${index + 1}`,
}));

type MobileGridProps = {
  className?: string;
};

const MobileGrid = ({ className }: MobileGridProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(12);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={clx("w-full p-4", className)}>
      <div
        className="grid grid-cols-2 overflow-hidden transition-all duration-500"
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
        <button
          onClick={handleShowMore}
          disabled={isLoading}
          className="mt-4 w-full h-12 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-6 h-6 relative">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[2px] h-1 bg-gray-300 rounded-[1px]"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 30}deg) translateY(-8px)`,
                    opacity: 0.25 + (i / 12) * 0.75,
                    animation: `ios-spinner 1s linear infinite`,
                    animationDelay: `${(i * -0.0833).toFixed(3)}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            "Показати ще"
          )}
        </button>
      )}
      <style jsx>{`
        @keyframes ios-spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileGrid;