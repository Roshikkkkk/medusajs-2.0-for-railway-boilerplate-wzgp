"use client";

import React from "react";
import { clx } from "@medusajs/ui";

export default function CatalogMobileBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clx(
        "w-full h-14 flex items-center justify-between px-4 bg-gray-900 text-white rounded-lg text-base font-semibold focus:outline-none select-none transition-colors duration-300 shadow-md"
      )}
      aria-label="Відкрити каталог товарів"
    >
      <div className="flex items-center">
        <img
          src="/icons/categories.svg"
          alt="Categories"
          className="w-6 h-6 mr-2 filter brightness-0 invert"
        />
        <span className="tracking-wide">Каталог товарів та пошук</span>
      </div>
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}