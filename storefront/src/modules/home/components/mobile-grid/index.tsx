import { clx } from "@medusajs/ui";
import MobileCard from "../mobile-card";

const gridItems = Array.from({ length: 12 }, (_, index) => ({
  id: `grid-item-${index + 1}`,
}));

type MobileGridProps = {
  className?: string;
};

const MobileGrid = ({ className }: MobileGridProps) => {
  return (
    <div className={clx("w-full p-4", className)}>
      <div className="grid grid-cols-2">
        {gridItems.map((item, index) => (
          <MobileCard key={item.id} index={index} />
        ))}
      </div>
    </div>
  );
};

export default MobileGrid;