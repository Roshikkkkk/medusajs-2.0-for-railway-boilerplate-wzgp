"use client";

import { useState } from "react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const currentCountryCode = params?.countryCode as string;
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex justify-center items-center h-8 pb-2 max-md:block md:hidden">
      <div className="relative flex justify-center items-center">
        <div
          className={clx(
            "absolute flex justify-center items-center gap-2 transition-all duration-300",
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
        <LocalizedClientLink
          href={`/${currentCountryCode}/banners`}
          onClick={handleClick}
          className={clx(
            "w-[150px] h-10 flex items-center justify-center px-6 bg-gray-800 text-white rounded-lg text-base font-semibold focus:outline-none hover:bg-gray-600 transition-colors duration-300 shadow-md",
            isLoading ? "opacity-75 cursor-not-allowed w-[180px]" : "hover:shadow-md",
            centeredIndex === banners.length - 1
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
          aria-label="Усі акції"
        >
          <span className="whitespace-nowrap">{isLoading ? "Завантаження" : "Усі акції"}</span>
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
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default SliderIndicators;