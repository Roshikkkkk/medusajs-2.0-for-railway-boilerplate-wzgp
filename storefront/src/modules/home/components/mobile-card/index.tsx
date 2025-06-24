import { clx } from "@medusajs/ui";

type MobileCardProps = {
  index: number;
};

const MobileCard = ({ index }: MobileCardProps) => {
  const productName = "Product Name Very Long Title Here";

  return (
    <div
      className={clx(
        "w-full h-[300px] bg-white border-b border-gray-200 flex flex-col transition-all duration-300",
        index % 2 === 0 && "border-r border-gray-200"
      )}
    >
      <div className="relative w-full h-[225px]">
        <img
          src="/images/banner3.jpg"
          alt="Product"
          className="absolute w-full h-full object-cover object-top"
        />
        <div className="absolute top-2 right-2">
          <img
            src="/icons/info.svg"
            alt="Info"
            className="w-5 h-5 fill-current"
            style={{ filter: "invert(74%) sepia(8%) saturate(200%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
          />
        </div>
      </div>
      <div className="flex flex-col p-2 h-[75px] justify-between">
        <span
          className="text-sm font-medium text-gray-900 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
          }}
        >
          {productName}
        </span>
        <span className="text-sm text-gray-600">$99.99</span>
      </div>
    </div>
  );
};

export default MobileCard;