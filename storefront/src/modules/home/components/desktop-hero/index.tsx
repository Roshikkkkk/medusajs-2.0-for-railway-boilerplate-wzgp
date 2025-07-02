"use client";

import { clx } from "@medusajs/ui";
import DesktopCard from "../desktop-card";
import { HttpTypes } from "@medusajs/types";
import { useState, useEffect } from "react";
import { getProductsList } from "@lib/data/products";
import { useSearchParams, useRouter } from "next/navigation";

interface DesktopHeroProps {
  countryCode: string;
  categories: any[];
  products: HttpTypes.StoreProduct[];
  region: HttpTypes.StoreRegion | null;
}

const DesktopHero = ({ countryCode, categories, products: initialProducts, region }: DesktopHeroProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<HttpTypes.StoreProduct[]>(initialProducts || []);

  // Reset selectedCategoryId when reset=true is in URL
  useEffect(() => {
    const reset = searchParams.get("reset");
    if (reset === "true") {
      setSelectedCategoryId(null);
      // Clean URL by removing reset parameter
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (selectedCategoryId && region?.id) {
        try {
          console.log(`Fetching products for category ID: ${selectedCategoryId}`);
          const { response } = await getProductsList({
            queryParams: { category_id: [selectedCategoryId], limit: 100 },
            countryCode,
          });
          console.log("API Response:", response);
          setFilteredProducts(response.products || []);
        } catch (error) {
          console.error("Error fetching category products:", error);
          setFilteredProducts([]);
        }
      } else {
        setFilteredProducts(initialProducts || []);
      }
    };
    fetchCategoryProducts();
  }, [selectedCategoryId, countryCode, region?.id, initialProducts]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);
  };

  const selectedCategoryName = categories.find((cat) => cat.id === selectedCategoryId)?.name || "Популярное";

  return (
    <div className="hidden lg:flex w-full h-full">
      <aside className="w-[220px] border-r border-gray-200">
        <div className="h-full flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
          <div className="p-2 pl-4 flex flex-col gap-1 h-full overflow-y-auto">
            {categories.map((category) => (
              <a
                key={category.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.id);
                }}
                className={clx(
                  "w-[195px] h-[28px] rounded flex items-center pl-6 pr-2.5 text-sm font-semibold font-sans text-gray-700 hover:bg-gray-100",
                  selectedCategoryId === category.id && "bg-gray-100"
                )}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </aside>
      <div className="w-full h-full flex flex-col">
        <div className="bg-[#FAFAFA] p-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">{selectedCategoryName}</span>
        </div>
        <div className={clx("w-full bg-white h-full")} style={{ minHeight: "960px" }}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={product.id} className="w-full">
                  <DesktopCard
                    index={index}
                    product={product}
                    region={region}
                    countryCode={countryCode}
                  />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">Нет товаров в этой категории</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHero;