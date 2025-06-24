import { clx } from "@medusajs/ui";
import DesktopCard from "../desktop-card";

const gridItems = Array.from({ length: 12 }, (_, index) => ({
  id: `grid-item-${index + 1}`,
}));

type DesktopGridProps = {
  className?: string;
};

const DesktopGrid = ({ className }: DesktopGridProps) => {
  return (
    <div className={clx("w-full p-4", className)}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {gridItems.map((item) => (
          <DesktopCard key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default DesktopGrid;