"use client";

import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@lib/util/get-product-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type DesktopCardProps = {
  index: number;
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion | null;
  countryCode: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://192.168.1.101:9000";
const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || BACKEND_URL;

const DesktopCard = ({ index, product, region, countryCode }: DesktopCardProps) => {
  const { cheapestPrice } = getProductPrice({ product, region });
  const formatPrice = (price?: string) => price ? price.replace("UAH", "₴") : "Ціна не вказана";
  const price = formatPrice(cheapestPrice?.calculated_price);
  const originalPrice = formatPrice(cheapestPrice?.original_price || cheapestPrice?.calculated_price);
  const isDiscounted = cheapestPrice?.percentage_diff > 0;
  const discountPercentage = cheapestPrice?.percentage_diff || 0;
  const thumbnailUrl = (product.images?.[0]?.url || product.thumbnail || "/images/placeholder.jpg")
    .replace("http://localhost:9000/static", MINIO_URL);

  return (
    <LocalizedClientLink href={`/products/${product.handle}?countryCode=${countryCode}`}>
      <div className="w-full h-[300px] bg-white flex flex-col border-r border-gray-200">
        <div className="relative w-full h-[225px] bg-gray-100 flex items-center justify-center">
          <img
            src={thumbnailUrl}
            alt={product.title || "Без назви"}
            className="max-w-full max-h-full object-contain"
          />
          {isDiscounted && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-1">
              Знижка -{discountPercentage}%
            </div>
          )}
        </div>
        <div className="flex flex-col p-2 h-[75px] justify-between">
          <span
            className="text-sm font-medium text-gray-900"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {product.title || "Без назви"}
          </span>
          <div className="flex items-center justify-between">
            {isDiscounted ? (
              <div className="flex items-center space-x-2">
                <span className="text-[15px] text-red-600 font-medium bg-gray-200 bg-opacity-50 px-2 py-0.5 rounded">
                  {price}
                </span>
                <span className="text-[15px] text-gray-500 font-medium line-through">
                  {originalPrice}
                </span>
              </div>
            ) : (
              <span className="text-[15px] text-gray-700 font-medium bg-gray-200 bg-opacity-50 px-2 py-0.5 rounded">
                {price}
              </span>
            )}
            <img src="/icons/cart.svg" alt="cart" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
};

export default DesktopCard;