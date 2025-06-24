import { clx } from "@medusajs/ui";

type MobileCardProps = {
  index: number;
};

const MobileCard = ({ index }: MobileCardProps) => {
  return (
    <div
      className={clx(
        "w-full aspect-square bg-white h-[150px] border-b border-gray-200",
        index % 2 === 0 && "border-r border-gray-200"
      )}
    />
  );
};

export default MobileCard;