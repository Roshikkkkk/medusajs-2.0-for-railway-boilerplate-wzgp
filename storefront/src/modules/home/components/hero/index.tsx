import { Suspense } from "react";
import HeroSlider from "@modules/home/components/hero-slider";
import MobileGrid from "@modules/home/components/mobile-grid";
import DesktopGrid from "@modules/home/components/desktop-grid";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { HttpTypes } from "@medusajs/types";
import CategoriesDesktop from "@modules/home/components/categories-desktop";

interface HeroProps {
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
}

interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
}

const Hero = async ({ collections: propCollections, countryCode }: HeroProps) => {
  let products: HttpTypes.StoreProduct[] = [];
  let region: HttpTypes.StoreRegion | null = null;

  try {
    const collection = await getCollectionByHandle("popular", { cache: "force-cache" });
    if (collection?.id) {
      const regionData = await getRegion(countryCode, { cache: "force-cache" });
      if (regionData?.id) {
        region = regionData;
        const { response } = await getProductsList({
          queryParams: { collection_id: [collection.id], limit: 100 } as ProductListQueryParams,
          countryCode,
          cache: "force-cache",
        });
        const productIds = response.products.map((p) => p.id!).filter(Boolean);
        if (productIds.length > 0) {
          products = (await getProductsById({ ids: productIds, regionId: regionData.id, cache: "force-cache" })) || [];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch products in Hero:", error);
  }

  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="flex flex-col h-full">
        <div className="hidden lg:flex w-full h-[52px] bg-white border-b border-gray-200">
          <div className="w-[220px] border-r border-gray-200"></div>
          <div className="flex-1"></div>
        </div>
        <div className="flex flex-col lg:flex-row h-full">
          <CategoriesDesktop countryCode={countryCode} />
          <div className="w-full lg:flex-1 flex flex-col h-full">
            <Suspense fallback={<div className="w-full h-full bg-gray-200" />}>
              <HeroSlider className="md:hidden" />
              <MobileGrid
                className="md:hidden"
                collections={propCollections}
                countryCode={countryCode}
                products={products}
                region={region}
              />
              <DesktopGrid
                className="hidden md:block h-full"
                collections={propCollections}
                countryCode={countryCode}
                products={products}
                region={region}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;