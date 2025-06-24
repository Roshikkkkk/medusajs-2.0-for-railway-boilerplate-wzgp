"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../card";
import SliderIndicators from "../SliderIndicators";

// Типизация баннера
type Banner = {
  id: string;
  name: string;
  imagePath: string; // Путь к изображению, например, '/images/banner1.jpg'
  href: string; // Ссылка для карточки
};

// Константы
const CARD_WIDTH = 350;
const GAP = 20;
const AUTO_SLIDE_INTERVAL = 5000;

const HeroSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Массив баннеров, который можно редактировать
  const banners: Banner[] = [
    { id: "1", name: "Banner 1", imagePath: "/images/banner1.jpg", href: "/banners/1" },
    { id: "2", name: "Banner 2", imagePath: "/images/banner2.jpg", href: "/banners/2" },
    { id: "3", name: "Banner 3", imagePath: "/images/banner3.jpg", href: "/banners/3" },
    { id: "4", name: "Banner 4", imagePath: "/images/banner4.jpg", href: "/banners/4" },
    { id: "5", name: "Banner 5", imagePath: "/images/banner5.jpg", href: "/banners/5" },
  ];

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

    if (window.innerWidth < 768) {
      const scrollAmount = CARD_WIDTH + GAP;
      const centerPosition = scrollLeft + clientWidth / 2 - CARD_WIDTH / 2;
      const newCenteredIndex = Math.floor(centerPosition / scrollAmount);
      setCenteredIndex(Math.max(0, Math.min(banners.length - 1, newCenteredIndex)));
    } else {
      setCenteredIndex(-1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = CARD_WIDTH + GAP;
    const scrollDistance = window.innerWidth >= 768 ? 2 * scrollAmount : scrollAmount;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollDistance : scrollDistance,
      behavior: "smooth",
    });
    if (window.innerWidth >= 768) {
      resetAutoSlide();
    }
  };

  const startAutoSlide = () => {
    if (window.innerWidth < 768 || !sliderRef.current) return;
    autoSlideTimerRef.current = setInterval(() => {
      if (canScrollRight) {
        scroll("right");
      } else {
        sliderRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, AUTO_SLIDE_INTERVAL);
  };

  const resetAutoSlide = () => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
    startAutoSlide();
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    startAutoSlide();

    const handleResize = () => {
      checkScroll();
      if (window.innerWidth < 768 && autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
        autoSlideTimerRef.current = null;
      } else if (window.innerWidth >= 768 && !autoSlideTimerRef.current) {
        startAutoSlide();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      slider.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", handleResize);
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [banners]);

  return (
    <div className="w-full border-t border-transparent relative">
      <div
        ref={sliderRef}
        className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[30px] py-[20px] mt-0"
        style={{ scrollPadding: "100px" }}
      >
        <div className="w-max h-full flex items-center gap-5">
          <div className="w-[100px] h-full flex-shrink-0 snap-align-start" />
          {banners.map((banner, index) => (
            <Card
              key={banner.id}
              banner={banner}
              isCentered={index === centeredIndex}
            />
          ))}
          <div className="w-[100px] h-full flex-shrink-0 snap-align-start" />
        </div>
      </div>

      <SliderIndicators banners={banners} centeredIndex={centeredIndex} />

      <div className="hidden md:flex justify-end gap-4 pb-8 pr-[30px]">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
            canScrollLeft
              ? "bg-[#DEDEE2] text-[#626263] hover:bg-[#D0D0D4]"
              : "bg-[#ECECEE] text-[#B8B8B9]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
            canScrollRight
              ? "bg-[#DEDEE2] text-[#626263] hover:bg-[#D0D0D4]"
              : "bg-[#ECECEE] text-[#B8B8B9]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

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