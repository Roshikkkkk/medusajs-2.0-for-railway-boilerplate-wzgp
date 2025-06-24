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
    <div className="flex justify-center items-center h-8 pb-4 max-md:block md:hidden">
      <div className="relative flex justify-center items-center">
        <div
          className={clx(
            "absolute flex justify-center items-center gap-2 transition-all duration-300 ease-in-out",
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
            "h-10 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center px-4",
            isLoading ? "w-[180px]" : "w-[120px]",
            centeredIndex === banners.length - 1
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <span className="whitespace-nowrap">Усі колекції</span>
          {isLoading && (
            <div className="w-6 h-6 relative ml-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[2px] h-1 bg-gray-300 rounded-[1px]"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 30}deg) translateY(-8px)`,
                    opacity: 0.25 + (i / 12) * 0.75,
                    animation: `ios-spinner 1s linear infinite`,
                    animationDelay: `${(i * -0.0833).toFixed(3)}s`,
                  }}
                />
              ))}
            </div>
          )}
        </LocalizedClientLink>
      </div>
      <style jsx>{`
        @keyframes ios-spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
};

export default SliderIndicators;