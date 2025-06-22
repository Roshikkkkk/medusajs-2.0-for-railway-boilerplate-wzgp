"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../card";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useParams } from "next/navigation";

// Типизация баннера (совместимо с Category)
type Banner = {
  id: string;
  name: string; // Используем name вместо title для совместимости с Card
  handle: string;
  description?: string;
};

const HeroSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [centeredIndex, setCenteredIndex] = useState(0);

  // Статичный массив баннеров для теста, совместимый с Category
  const banners: Banner[] = [
    { id: "1", name: "Banner 1", handle: "banner1", description: "" },
    { id: "2", name: "Banner 2", handle: "banner2", description: "" },
    { id: "3", name: "Banner 3", handle: "banner3", description: "" },
    { id: "4", name: "Banner 4", handle: "banner4", description: "" },
    { id: "5", name: "Banner 5", handle: "banner5", description: "" },
  ];

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

      if (window.innerWidth < 768) {
        const cardWidth = 350;
        const gap = 20;
        const scrollAmount = cardWidth + gap;
        const centerPosition = scrollLeft + clientWidth / 2 - cardWidth / 2;
        const newCenteredIndex = Math.floor(centerPosition / scrollAmount);
        setCenteredIndex(Math.max(0, Math.min(banners.length - 1, newCenteredIndex)));
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const cardWidth = 350;
      const gap = 20;
      const scrollAmount = cardWidth + gap;
      const scrollDistance = scrollAmount;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
      return () => slider.removeEventListener("scroll", checkScroll);
    }
  }, [banners]);

  const params = useParams();
  const currentCountryCode = params?.countryCode as string;

  return (
    <div className="w-full border-t border-transparent relative">
      {/* Мобильная версия (горизонтальный скроллинг) */}
      <div
        ref={sliderRef}
        className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[30px] py-[20px] mt-0 max-md:block md:hidden"
        style={{ scrollPadding: "100px" }}
      >
        <div className="w-max h-full flex items-center gap-5">
          <div className="w-[100px] max-md:w-[1px] h-full flex-shrink-0 snap-align-start" />
          {banners.map((banner, index) => (
            <Card
              key={banner.id}
              category={banner}
              isCentered={index === centeredIndex}
            />
          ))}
          <div className="w-[100px] h-full flex-shrink-0 snap-align-start" />
        </div>
      </div>

      <div className="flex justify-center items-center h-8 pb-4 max-md:block md:hidden">
        <div className="relative flex justify-center items-center">
          <div
            className={`absolute flex justify-center items-center gap-2 transition-all duration-300 ease-in-out ${
              centeredIndex === banners.length - 1
                ? "opacity-0 scale-95 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
          >
            {banners.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === centeredIndex ? "bg-[#007AFF] scale-125" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
          <LocalizedClientLink
            href={`/${currentCountryCode}/banners`}
            className={`flex items-center gap-1 px-5 py-2 bg-[#DEDEE2] text-[#626263] rounded-full text-[15px] font-medium transition-all duration-300 ease-in-out hover:bg-[#D0D0D4] ${
              centeredIndex === banners.length - 1
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            Усі банери
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Кнопки скрыты на ПК */}
      <div className="hidden md:block"></div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;