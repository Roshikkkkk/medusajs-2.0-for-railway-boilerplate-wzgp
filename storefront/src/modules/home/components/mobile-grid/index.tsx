"use client";

import React, { useState, useEffect, useRef } from "react";
import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";
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
  const [visibleCount, setVisibleCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("visibleCount_popular");
      return saved ? parseInt(saved, 10) : 6;
    }
    return 6;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Сохраняем visibleCount в sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("visibleCount_popular", visibleCount.toString());
    }
  }, [visibleCount]);

  // Сбрасываем visibleCount, если products изменились
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("visibleCount_popular");
      const savedCount = saved ? parseInt(saved, 10) : 6;
      if (products.length < savedCount) {
        setVisibleCount(products.length);
        sessionStorage.setItem("visibleCount_popular", products.length.toString());
      } else {
        setVisibleCount(savedCount);
      }
    }
  }, [products]);

  // Настройка IntersectionObserver для бесконечного скролла
  useEffect(() => {
    if (!observerRef.current || isLoading || visibleCount >= products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => {
              const newCount = Math.min(prev + 6, products.length);
              sessionStorage.setItem("visibleCount_popular", newCount.toString());
              return newCount;
            });
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, products.length, isLoading]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div
      className={clx(
        "w-full pt-0 pb-4 bg-white border-t border-gray-200 mt-4",
        className
      )}
    >
      <div className="px-4 py-4">
        <CatalogMobileBtn onClick={toggleModal} />
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-4">Популярні товари</h2>
      </div>

      <MobileModal isOpen={isModalOpen} onClose={toggleModal} />

      <div className="grid grid-cols-2 w-full gap-4 px-4">
        {products.slice(0, visibleCount).map((product, index) => (
          <div
            key={product.id}
            className={clx(
              "transition-opacity duration-500",
              index >= 6 && visibleCount <= 6 ? "opacity-0" : "opacity-100"
            )}
          >
            <MobileCard index={index} product={product} region={region} countryCode={countryCode} />
          </div>
        ))}
      </div>

      {visibleCount < products.length && (
        <div ref={observerRef} className="h-10 flex justify-center items-center">
          {isLoading && (
            <svg
              className="w-8 h-8 animate-spin text-[#007AFF]"
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
        </div>
      )}
    </div>
  );
}