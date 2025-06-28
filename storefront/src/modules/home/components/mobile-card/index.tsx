import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@lib/util/get-product-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useState } from "react";

interface GetProductPriceParams {
  product: HttpTypes.StoreProduct;
  region?: HttpTypes.StoreRegion | null | undefined;
}

type MobileCardProps = {
  index: number;
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion | null;
  countryCode: string;
};

const MobileCard = ({ index, product, region, countryCode }: MobileCardProps) => {
  const productName = product.title || "Без назви";
  const { cheapestPrice } = getProductPrice({ product, region } as GetProductPriceParams);
  const price = cheapestPrice?.calculated_price || "Ціна не вказана";
  const thumbnail = product.thumbnail || "/images/placeholder.jpg";
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsLoading(true);
    // Эмуляция задержки загрузки (можно убрать, если есть точное событие навигации)
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}?countryCode=${countryCode}`}
      className="block relative"
      onClick={handleClick}
      onTouchStart={handleClick} // Для мобильных
    >
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
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
    </LocalizedClientLink>
  );
};

export default MobileCard;