"use client";

import { clx } from "@medusajs/ui";
import DesktopCard from "../desktop-card";
import { HttpTypes } from "@medusajs/types";

type DesktopGridProps = {
  className?: string;
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
  products?: HttpTypes.StoreProduct[];
  region: HttpTypes.StoreRegion | null;
};

const DesktopGrid = ({ className, collections, countryCode, products = [], region }: DesktopGridProps) => {
  const visibleProducts = products.slice(0, 100);

  if (!visibleProducts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-base">Популярні товари відсутні</p>
      </div>
    );
  }

  return (
    <div className={clx("w-full bg-white h-full", className)}>
      <div className="py-2 px-4">
        <h2 className="text-base font-semibold" style={{ color: '#2b2926' }}>
          Популярні товари
        </h2>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
        {visibleProducts.map((product, index) => (
          <div key={product.id} className="w-full">
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