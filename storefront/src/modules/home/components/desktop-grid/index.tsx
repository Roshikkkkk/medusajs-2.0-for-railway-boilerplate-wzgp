"use client";

import React, { useState, useEffect, useRef } from "react";
import { clx } from "@medusajs/ui";
import DesktopCard from "../desktop-card";
import { HttpTypes } from "@medusajs/types";

type DesktopGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
  products?: HttpTypes.StoreProduct[];
  region: HttpTypes.StoreRegion | null;
};

const DesktopGrid = ({ className, collections, countryCode, products = [], region }: DesktopGridProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const maxProducts = Math.min(products.length, 18); // Ограничение до 18 или меньше

  // Lazy loading с Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && visibleCount < maxProducts) {
          setIsLoading(true);
          setVisibleCount((prev) => Math.min(prev + 6, maxProducts));
          setIsLoading(false);
        }
      },
      { rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, visibleCount, maxProducts]);

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No popular products available</p>
      </div>
    );
  }

  return (
    <div className={clx("w-full pt-0 pb-4 bg-white border-t border-gray-200 mt-4", className)}>
      <div className="px-4 py-4">
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-4">Популярні товари</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full overflow-hidden border-t border-gray-200">
        {products.slice(0, visibleCount).map((product, index) => (
          <div key={product.id} className="animate-fadeIn">
            <DesktopCard
              index={index}
              product={product}
              region={region}
              countryCode={countryCode}
            />
          </div>
        ))}
      </div>

      {visibleCount < maxProducts && (
        <div ref={loaderRef} className="mt-4 flex justify-center">
          {isLoading && (
            <div className="h-12 w-[150px] flex items-center justify-center">
              <svg
                className="w-5 h-5 animate-spin text-[#007AFF]"
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
              <span className="ml-2 text-sm text-[#007AFF]">Зачекайте...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesktopGrid;