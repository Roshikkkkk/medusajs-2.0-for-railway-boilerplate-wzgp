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
  const [visibleCount, setVisibleCount] = useState(6); // Начальное значение для сервера
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Инициализация visibleCount из localStorage только на клиенте
  useEffect(() => {
    try {
      const saved = localStorage.getItem("visibleProductCount");
      if (saved && !isNaN(parseInt(saved, 10))) {
        setVisibleCount(parseInt(saved, 10));
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  }, []);

  // Сохранение visibleCount в localStorage
  useEffect(() => {
    try {
      localStorage.setItem("visibleProductCount", visibleCount.toString());
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  }, [visibleCount]);

  // Lazy load с IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleCount < products.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 6, products.length)); // Не превышаем длину products
            setIsLoading(false);
          }, 500); // Задержка для имитации загрузки
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, visibleCount, products.length]);

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

      <div className="grid grid-cols-2 w-full overflow-hidden transition-all duration-500 border-t border-gray-200">
        {products.slice(0, visibleCount).map((product, index) => (
          <div
            key={product.id}
            className={clx(
              "transition-opacity duration-500",
              index >= visibleCount - 6 ? "opacity-0" : "opacity-100"
            )}
          >
            <MobileCard index={index} product={product} region={region} countryCode={countryCode} />
          </div>
        ))}
      </div>

      {visibleCount < products.length && (
        <div ref={observerRef} className="flex justify-center py-4">
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
        </div>
      )}
    </div>
  );
}