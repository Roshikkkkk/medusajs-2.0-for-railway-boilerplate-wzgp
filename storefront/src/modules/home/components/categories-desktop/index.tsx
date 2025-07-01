"use client";

import { useState, useEffect } from "react";
import { listCategories } from "@lib/data/categories";

interface CategoriesDesktopProps {
  countryCode: string;
  onCategorySelect?: (categoryId: string) => void;
}

const CategoriesDesktop = ({ countryCode, onCategorySelect }: CategoriesDesktopProps) => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories().catch(() => []);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [countryCode]);

  return (
    <aside className="hidden lg:block w-[220px] border-r border-gray-200">
      <div className="h-full flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="p-2 pl-4 flex flex-col gap-1 h-full overflow-y-auto">
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect?.(category.id)}
                className="w-[195px] h-[28px] rounded flex items-center pl-6 pr-2.5 text-sm font-semibold font-sans text-gray-700 hover:bg-gray-100"
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">Категорії відсутні</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CategoriesDesktop;