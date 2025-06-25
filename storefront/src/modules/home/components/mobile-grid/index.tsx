"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";
import { HttpTypes } from "@medusajs/types";
import MobileModal from "../mobile-modal";

type MobileGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
};

const gridItems = Array.from({ length: 12 }, (_, i) => ({
  id: `grid-item-${i + 1}`,
}));

export default function MobileGrid({ className, collections }: MobileGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(12);
      setIsLoading(false);
    }, 500);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Блокировка скролла страницы
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
      <div className="px-4 py-8">
        <button
          onClick={toggleModal}
          className={clx(
            "w-full h-14 flex items-center justify-between px-4 bg-gray-100 text-gray-900 rounded-md text-base font-medium",
            "transition-all duration-300"
          )}
          aria-label="Каталог товарів"
          type="button"
        >
          <div className="flex items-center">
            <img src="/icons/categories.svg" alt="Categories" className="w-5 h-5 mr-2" />
            <span>Каталог товарів</span>
          </div>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <MobileModal isOpen={isModalOpen} onClose={toggleModal} />

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