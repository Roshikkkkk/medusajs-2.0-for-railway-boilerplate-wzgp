"use client";

import { useEffect, useState } from "react";
import { clx } from "@medusajs/ui";

const FloatingCategoriesButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={clx(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-[#DEDEE2] text-[#626263] rounded-full shadow-lg text-sm font-medium transition-opacity duration-300 md:hidden",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      Категории
    </button>
  );
};

export default FloatingCategoriesButton;