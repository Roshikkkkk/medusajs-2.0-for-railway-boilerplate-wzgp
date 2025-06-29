import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@lib/util/get-product-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

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
  console.log("Product ID:", product.id, "Thumbnail:", product.thumbnail);
  const { cheapestPrice } = getProductPrice({ product, region } as GetProductPriceParams);
  console.log("Cheapest price:", cheapestPrice);
  const price = cheapestPrice?.calculated_price
    ? cheapestPrice.calculated_price.replace("UAH", "₴")
    : "Ціна не вказана";
  const thumbnail = product.thumbnail || product.images?.[0]?.url || "/images/placeholder.jpg";
  console.log("Final Thumbnail URL:", thumbnail);

  return (
    <LocalizedClientLink href={`/products/${product.handle}?countryCode=${countryCode}`} className="block">
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
            onError={() => console.error(`Failed to load image for ${productName}: ${thumbnail}`)}
          />
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
            <span className="text-[15px] text-gray-700 font-medium bg-gray-200 bg-opacity-50 px-2 py-0.5 rounded">{price}</span>
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

export default MobileCard;