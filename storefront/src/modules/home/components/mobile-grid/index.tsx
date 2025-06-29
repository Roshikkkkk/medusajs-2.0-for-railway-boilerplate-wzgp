"use client";

import React, { useState, useEffect, useRef } from "react";
import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";
import MobileCardSkeleton from "../Mobile-Card-Skeleton";
import { HttpTypes } from "@medusajs/types";
import MobileModal from "../mobile-modal";
import CatalogMobileBtn from "../catalog-mobile-btn";

type MobileGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
  products: HttpTypes.StoreProduct[];
  region: HttpTypes.StoreRegion | null;
};

export default function MobileGrid({ className, collections, countryCode, products, region }: MobileGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const maxProducts = Math.min(products.length, 18); // Ограничение до 18 или меньше

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Проверяем начальную загрузку
  useEffect(() => {
    if (products.length > 0) {
      setIsInitialLoading(false);
    }
  }, [products]);

  // Lazy loading с Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && !isInitialLoading && visibleCount < maxProducts) {
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
  }, [isLoading, isInitialLoading, visibleCount, maxProducts]);

  if (!products.length && !isInitialLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No popular products available</p>
      </div>
    );
  }

  // Количество скелетонов для подгрузки
  const skeletonCount = Math.min(maxProducts - visibleCount, 6);

  return (
    <div className={clx("w-full pt-0 pb-4 bg-white border-t border-gray-200 mt-4", className)}>
      <div className="px-4 py-4">
        <CatalogMobileBtn onClick={toggleModal} />
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-4">Популярні товари</h2>
      </div>

      <MobileModal isOpen={isModalOpen} onClose={toggleModal} />

      <div className="grid grid-cols-2 w-full overflow-hidden border-t border-gray-200">
        {isInitialLoading
          ? Array.from({ length: Math.min(products.length, 6) }).map((_, index) => (
              <div key={`initial-skeleton-${index}`} className="animate-pulse">
                <MobileCardSkeleton index={index} />
              </div>
            ))
          : products.slice(0, visibleCount).map((product, index) => (
              <div key={product.id} className="animate-fadeIn">
                <MobileCard index={index} product={product} region={region} countryCode={countryCode} />
              </div>
            ))}
        {!isInitialLoading &&
          isLoading &&
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={`skeleton-${index}`} className="animate-pulse">
              <MobileCardSkeleton index={index} />
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

      {visibleCount >= maxProducts && (
        <div className="mt-4 px-4">
          <CatalogMobileBtn onClick={toggleModal} />
        </div>
      )}
    </div>
  );
}