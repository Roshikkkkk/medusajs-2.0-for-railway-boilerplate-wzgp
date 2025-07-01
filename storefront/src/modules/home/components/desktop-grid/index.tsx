// DesktopGrid.jsx
"use client";

import { clx } from "@medusajs/ui";
import DesktopCard from "../desktop-card";
import { HttpTypes } from "@medusajs/types";

type DesktopGridProps = {
  className?: string;
  products: HttpTypes.StoreProduct[];
  region: HttpTypes.StoreRegion | null;
  countryCode: string;
};

const DesktopGrid = ({ className, products, region, countryCode }: DesktopGridProps) => {
  return (
    <div className={clx("w-full bg-white h-full", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
        {products.map((product, index) => (
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