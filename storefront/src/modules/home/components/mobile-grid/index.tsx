"use client";

import React, { useState, useEffect } from "react";
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
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Завантаження стану з localStorage при монтуванні компонента
  useEffect(() => {
    try {
      const saved = localStorage.getItem("visibleProductCount");
      if (saved && !isNaN(parseInt(saved, 10))) {
        const savedCount = parseInt(saved, 10);
        // Скидаємо до 6, якщо перезавантаження в новій вкладці і savedCount >= products.length
        if (savedCount >= products.length) {
          setVisibleCount(6);
          localStorage.setItem("visibleProductCount", "6");
        } else {
          setVisibleCount(savedCount);
        }
      }
      console.log("Initialized visibleCount:", visibleCount, "products length:", products.length);
    } catch (e) {
      console.error("Не вдалося завантажити visibleCount з localStorage:", e);
    }
  }, [products.length]); // Додано залежність від products.length для скиду при зміні даних

  // Збереження стану в localStorage при зміні visibleCount
  useEffect(() => {
    try {
      localStorage.setItem("visibleProductCount", visibleCount.toString());
      console.log("Saved visibleCount:", visibleCount);
    } catch (e) {
      console.error("Не вдалося зберегти visibleCount у localStorage:", e);
    }
  }, [visibleCount]);

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoading(false);
    }, 500);
  };

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

      <div
        className="grid grid-cols-2 w-full overflow-y-auto transition-all duration-500 border-t border-gray-200"
        // Замінив overflow-hidden на overflow-y-auto, щоб уникнути обрізання
      >
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