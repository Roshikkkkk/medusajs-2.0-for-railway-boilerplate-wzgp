import { clx } from "@medusajs/ui";

type MobileCardSkeletonProps = {
  index: number;
};

const MobileCardSkeleton = ({ index }: MobileCardSkeletonProps) => {
  return (
    <div
      className={clx(
        "w-full h-[300px] bg-white border-b border-gray-200 flex flex-col",
        index % 2 === 0 && "border-r border-gray-200"
      )}
    >
      <div className="relative w-full h-[225px]">
        <div className="absolute w-full h-full bg-gray-200 animate-pulse" />
      </div>
      <div className="flex flex-col p-2 h-[75px] justify-between">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default MobileCardSkeleton;