"use client";

import { useState, useEffect } from "react";
import { listCategories } from "@lib/data/categories";

interface CategoriesDesktopProps {
  countryCode: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoriesDesktop = ({ countryCode, onCategorySelect }: CategoriesDesktopProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await listCategories({ cache: "force-cache" }).catch(() => []);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [countryCode]);

  const SkeletonLoader = () => (
    <div className="p-2 pl-4 flex flex-col gap-1">
      {Array(5).fill(null).map((_, index) => (
        <div key={index} className="w-[195px] h-[28px] bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );

  return (
    <aside className="hidden lg:block w-[220px] border-r border-gray-200 h-screen">
      <div className="bg-white h-full flex flex-col">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="p-2 pl-4 flex flex-col gap-1 overflow-y-auto">
            {categories.length > 0 ? (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className="w-[195px] h-[28px] rounded flex items-center pl-6 pr-2.5 text-sm font-semibold font-sans text-gray-700 hover:bg-gray-100"
                >
                  {category.name}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Категорії відсутні</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default CategoriesDesktop;