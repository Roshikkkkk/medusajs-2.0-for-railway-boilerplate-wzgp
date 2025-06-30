"use client";

import { clx } from "@medusajs/ui";

// Типизация баннера
type Banner = {
  id: string;
  name: string;
  imagePath: string;
  href: string;
};

interface SliderIndicatorsProps {
  banners: Banner[];
  centeredIndex: number;
}

const SliderIndicators: React.FC<SliderIndicatorsProps> = ({ banners, centeredIndex }) => {
  return (
    <div className="flex justify-center items-center h-3 pb-2 mt-2 max-md:block md:hidden">
      <div className="relative flex justify-center items-center">
        <div
          className={clx(
            "flex justify-center items-center gap-2 transition-all duration-300",
            centeredIndex === banners.length - 1
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          )}
        >
          {banners.map((_, index) => (
            <span
              key={index}
              className={clx(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === centeredIndex ? "bg-[#007AFF] scale-125" : "bg-gray-400"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderIndicators;