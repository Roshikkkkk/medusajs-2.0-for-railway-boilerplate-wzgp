"use client";

import { useState, useEffect } from "react";
import { clx } from "@medusajs/ui";
import DesktopCard from "../desktop-card";
import { HttpTypes } from "@medusajs/types";
import { getProductsList } from "@lib/data/products";

type DesktopGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
  products?: HttpTypes.StoreProduct[];
  region: HttpTypes.StoreRegion | null;
  selectedCategoryId?: string;
};

const DesktopGrid = ({ className, collections, countryCode, products = [], region, selectedCategoryId }: DesktopGridProps) => {
  const [gridProducts, setGridProducts] = useState<HttpTypes.StoreProduct[]>(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!selectedCategoryId || !region?.id) {
        setGridProducts(products); // Оставляем товары из "popular" по умолчанию
        return;
      }

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Плавная анимация
        const { response } = await getProductsList({
          queryParams: { category_id: [selectedCategoryId], limit: 100 },
          countryCode,
          cache: "no-store",
        });
        setGridProducts(response.products || []);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
        setGridProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategoryId, countryCode, region?.id, products]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!gridProducts.length && selectedCategoryId) {
    return (
      <div className="w-full h-screen flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100">
        <p className="text-gray-500 text-base">Товари в цій категорії немае</p>
      </div>
    );
  }

  return (
    <div className={clx("w-full bg-white h-screen", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 transition-opacity duration-500 ease-in-out" style={{ opacity: 1 }}>
        {gridProducts.map((product, index) => (
          <div key={product.id} className="w-full transition-opacity duration-500 ease-in-out">
            <DesktopCard
              index={index}
              product={product}
              region={region}
              countryCode={countryCode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopGrid;