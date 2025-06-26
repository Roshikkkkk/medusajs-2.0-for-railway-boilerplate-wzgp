import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@lib/util/get-product-price";

type MobileCardProps = {
  index: number;
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion | null;
};

const MobileCard = ({ index, product, region }: MobileCardProps) => {
  const productName = product.title || "Без назви";
  console.log("Product:", product); // Отладка
  const { cheapestPrice } = getProductPrice({ product, region });
  console.log("Cheapest price:", cheapestPrice); // Отладка
  const price = cheapestPrice?.calculated_price || "Ціна не вказана";
  const thumbnail = product.thumbnail || "/images/placeholder.jpg";

  return (
    <div
      className={clx(
        "w-full h-[300px] bg-white border-b border-gray-200 flex flex-col transition-all duration-300",
        index % 2 === 0 && "border-r border-gray-200"
      )}
    >
      <div className="relative w-full h-[225px]">
        <img
          src={thumbnail}
          alt={productName}
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
        <span className="text-sm text-gray-600">{price}</span>
      </div>
    </div>
  );
};

export default MobileCard;