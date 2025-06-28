"use client";

import { useState, useEffect } from "react";
import { listRegions } from "@lib/data/regions";
import { StoreRegion } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

// Define props interface
interface NavProps {
  onClose: () => void;
}

export default function Nav({ onClose }: NavProps) {
  const [regions, setRegions] = useState<StoreRegion[]>([]);

  useEffect(() => {
    async function fetchRegions() {
      const fetchedRegions = await listRegions();
      setRegions(fetchedRegions);
    }
    fetchRegions();
  }, []);

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-24 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container flex flex-col items-center justify-between w-full h-full">
          <div className="w-full flex items-center justify-between mt-2 relative">
            <button
              className="text-sm font-light text-gray-800 hover:text-blue-600 absolute left-0"
              onClick={onClose}
              data-testid="nav-back-button"
            >
              Назад
            </button>
            <div className="flex-1 text-center">
              <LocalizedClientLink
                href="/"
                className="text-sm font-bold hover:text-ui-fg-base uppercase"
                data-testid="nav-store-link"
              >
                Каталог та пошук
              </LocalizedClientLink>
            </div>
          </div>
          <div className="w-full mt-4 mb-5">
            <input
              type="text"
              placeholder="Пошук..."
              className="w-full h-10 px-4 bg-gray-100 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </nav>
      </header>
    </div>
  );
}