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

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://192.168.1.101:9000";
const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || BACKEND_URL;

const getImageUrl = (imageUrl?: string | null, thumbnail?: string | null): string => {
  const baseUrl = imageUrl || thumbnail || "/images/placeholder.jpg";
  return baseUrl.replace("http://localhost:9000/static", MINIO_URL);
};

const MobileCard = ({ index, product, region, countryCode }: MobileCardProps) => {
  const productName = product.title || "Без назви";
  const { cheapestPrice } = region ? getProductPrice({ product, region } as GetProductPriceParams) : { cheapestPrice: null };
  const price = cheapestPrice?.calculated_price?.replace("UAH", "₴") || "Ціна не вказана";
  const thumbnailUrl = getImageUrl(product.images?.[0]?.url, product.thumbnail);

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
            src={thumbnailUrl}
            alt={productName}
            loading="lazy"
            className="absolute w-full h-full object-cover object-top"
          />
          <div className="absolute top-2 right-2">
            <img
              src="/icons/eye.svg"
              alt="Переглянути товар"
              className="w-5 h-5 fill-current eye-icon"
            />
          </div>
        </div>
        <div className="flex flex-col p-2 h-[75px] justify-between">
          <span className="text-base-regular text-gray-900 line-clamp-2">{productName}</span>
          <div className="flex items-center justify-between">
            <span className="text-small-regular text-gray-700 font-medium bg-gray-200 bg-opacity-50 px-2 py-0.5 rounded">
              {price}
            </span>
            <button
              aria-label="Додати до кошика"
              className="focus:outline-none"
            >
              <img
                src="/icons/cart.svg"
                alt="Додати до кошика"
                className="w-5 h-5 fill-current cart-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  );
};

export default MobileCard;