"use client";

import { clx } from "@medusajs/ui";

type DesktopGridProps = {
  className?: string;
  countryCode: string;
};

const DesktopGrid = ({ className, countryCode }: DesktopGridProps) => {
  return (
    <div className={clx("w-full bg-white min-h-screen flex items-center justify-center", className)}>
      <p className="text-gray-500 text-base text-center">Популярні товари відсутні</p>
    </div>
  );
};

export default DesktopGrid;