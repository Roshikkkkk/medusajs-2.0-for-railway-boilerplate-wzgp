import { Suspense } from "react";
import HeroSlider from "@modules/home/components/hero-slider";
import MobileGrid from "@modules/home/components/mobile-grid";
import DesktopHero from "@modules/home/components/desktop-hero";
import { HttpTypes } from "@medusajs/types";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

interface HeroProps {
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
  categories: any[];
}

interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
}

const Hero = async ({ collections: propCollections, countryCode, categories }: HeroProps) => {
  let products: HttpTypes.StoreProduct[] = [];
  let region: HttpTypes.StoreRegion | null = null;

  try {
    const collection = await getCollectionByHandle("popular");
    if (collection?.id) {
      const regionData = await getRegion(countryCode);
      if (regionData?.id) {
        region = regionData;
        const { response } = await getProductsList({
          queryParams: { collection_id: [collection.id], limit: 100 },
          countryCode,
        });
        const productIds = response.products.map((p) => p.id!).filter(Boolean);
        if (productIds.length > 0) {
          products = (await getProductsById({ ids: productIds, regionId: regionData.id })) || [];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch products in Hero:", error);
  }

  return (
    <div className="w-full border-b border-ui-border-base bg-[#FAFAFA]">
      <div className="flex flex-col h-full">
        <div className="hidden lg:flex w-full h-[52px] bg-[#FAFAFA] border-b border-gray-200">
          <div className="w-[220px] h-[51px] bg-[#FAFAFA] border-r border-gray-200 flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="font-medium font-sans txt-compact-large truncate pl-6"
              data-testid="nav-store-link"
            >
              Torgash Store
            </LocalizedClientLink>
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="flex flex-col lg:flex-row h-full">
          <DesktopHero
            countryCode={countryCode}
            categories={categories}
            products={products}
            region={region}
          />
          <div className="w-full lg:flex-1 flex flex-col h-full">
            <Suspense>
              <HeroSlider className="md:hidden" />
              <MobileGrid
                className="md:hidden"
                collections={propCollections}
                countryCode={countryCode}
                products={products}
                region={region}
              />
              <div className="hidden md:block h-full"></div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;