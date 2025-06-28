"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";
import { HttpTypes } from "@medusajs/types";
import MobileModal from "../mobile-modal";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import CatalogMobileBtn from "../catalog-mobile-btn"; // Импорт нового компонента

// Определяем тип для queryParams, если он не определён в библиотеке
interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
  // Другие возможные параметры можно добавить
}

type MobileGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
};

export default function MobileGrid({ className, collections, countryCode }: MobileGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null);

  useEffect(() => {
    async function fetchPopularProducts() {
      try {
        setIsLoading(true);
        const collection = await getCollectionByHandle("popular");
        if (!collection?.id) {
          console.error("Collection 'popular' not found");
          return;
        }
        console.log("Collection:", collection); // Отладка

        const regionData = await getRegion(countryCode);
        if (!regionData?.id) {
          console.error("Region not found for countryCode:", countryCode);
          return;
        }
        console.log("Region:", regionData); // Отладка
        setRegion(regionData);

        const { response } = await getProductsList({
          queryParams: { collection_id: [collection.id], limit: 12 } as ProductListQueryParams, // Уточнённый тип
          countryCode,
        });
        console.log("Products response:", response); // Отладка

        // Запрашиваем товары с ценами через getProductsById
        const productIds = response.products.map((p) => p.id!).filter(Boolean);
        if (productIds.length > 0) {
          const pricedProducts = await getProductsById({
            ids: productIds,
            regionId: regionData.id,
          });
          console.log("Priced products:", pricedProducts); // Отладка
          setProducts(pricedProducts);
        } else {
          console.log("No product IDs found");
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularProducts();
  }, [countryCode]);

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
      <div className="px-4 py-4">
        <CatalogMobileBtn onClick={toggleModal} /> {/* Новая кнопка на всю ширину */}
      </div>

      <MobileModal isOpen={isModalOpen} onClose={toggleModal} />

      <div
        className="grid grid-cols-2 w-full overflow-hidden transition-all duration-500 border-t border-gray-200"
        style={{ maxHeight: visibleCount === 6 ? "900px" : "1800px" }}
      >
        {products.slice(0, visibleCount).map((product, index) => (
          <div
            key={product.id}
            className={clx(
              "transition-opacity duration-500",
              index >= 6 && visibleCount === 6 ? "opacity-0" : "opacity-100"
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