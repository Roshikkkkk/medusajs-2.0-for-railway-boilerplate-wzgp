"use client";

import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@lib/util/get-product-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

interface GetProductPriceParams {
  product: HttpTypes.StoreProduct;
  region?: HttpTypes.StoreRegion | null | undefined;
}

type DesktopCardProps = {
  index: number;
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion | null;
  countryCode: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://192.168.1.101:9000";
const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || BACKEND_URL;

const DesktopCard = ({ index, product, region, countryCode }: DesktopCardProps) => {
  const productName = product.title || "Без назви";
  const { cheapestPrice } = getProductPrice({ product, region } as GetProductPriceParams);

  // Format price to show ₴ instead of UAH
  const formatPrice = (price: string | undefined) => {
    if (!price) return "Ціна не вказана";
    return price.replace("UAH", "₴");
  };

  const price = formatPrice(cheapestPrice?.calculated_price);
  const originalPrice = formatPrice(cheapestPrice?.original_price || cheapestPrice?.calculated_price);
  const thumbnailUrl = (product.images && product.images.length > 0 ? product.images[0].url : product.thumbnail)
    ?.replace("http://localhost:9000/static", MINIO_URL)
    || "/images/placeholder.jpg";

  const isDiscounted = cheapestPrice?.percentage_diff > 0;
  const discountPercentage = cheapestPrice?.percentage_diff || 0;

  return (
    <LocalizedClientLink href={`/products/${product.handle}?countryCode=${countryCode}`} className="block">
      <div
        className={clx(
          "w-full h-[300px] bg-white border-b border-gray-200 flex flex-col transition-all duration-300",
          index % 2 === 0 && "border-r border-gray-200"
        )}
      >
        <div className="relative w-full h-[225px] bg-gray-100">
          <img
            src={thumbnailUrl}
            alt={productName}
            className="absolute w-full h-full object-contain"
          />
          {isDiscounted && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-1">
              -{discountPercentage}%
            </div>
          )}
          <div className="absolute top-2 right-2">
            <img
              src="/icons/eye.svg"
              alt="eye"
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
          <div className="flex items-center justify-between">
            {isDiscounted && (
              <div className="flex items-center space-x-2">
                <span className="text-[15px] text-red-600 font-medium bg-gray-200 bg-opacity-50 px-2 py-0.5 rounded">
                  {price}
                </span>
                <span className="text-[15px] text-gray-500 font-medium line-through">
                  {originalPrice}
                </span>
              </div>
            )}
            {!isDiscounted && (
              <span className="text-[15px] text-gray-700 font-medium bg-gray-200 bg-opacity-50 px-2 py-0.5 rounded">{price}</span>
            )}
            <span>
              <img
                src="/icons/cart.svg"
                alt="cart"
                className="w-5 h-5 fill-current"
                style={{ filter: "invert(48%) sepia(79%) saturate(2476%) hue-rotate(190deg) brightness(100%) contrast(97%)" }}
              />
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
};

export default DesktopCard;