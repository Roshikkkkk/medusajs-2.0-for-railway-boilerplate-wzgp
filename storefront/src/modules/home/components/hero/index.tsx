import { Suspense } from "react";
import HeroSlider from "@modules/home/components/hero-slider";
import MobileGrid from "@modules/home/components/mobile-grid";
import DesktopGrid from "@modules/home/components/desktop-grid";
import { listCategories } from "@lib/data/categories";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { HttpTypes } from "@medusajs/types";
import CategoriesDesktop from "@modules/home/components/categories-desktop";
import { getCollectionsList } from "@lib/data/collections";

interface HeroProps {
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
}

interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
}

// Wrapper component for CategoriesDesktop data fetching
const CategoriesDesktopWrapper = async ({ countryCode }: { countryCode: string }) => {
  let categories: any[] = [];
  let collections: HttpTypes.StoreCollection[] = [];

  try {
    categories = (await listCategories()) || [];
  } catch (error) {
    console.error("Failed to fetch categories in CategoriesDesktopWrapper:", error);
  }

  try {
    const { collections: fetchedCollections } = await getCollectionsList(0, 10);
    collections = fetchedCollections || [];
  } catch (error) {
    console.error("Failed to fetch collections in CategoriesDesktopWrapper:", error);
  }

  return (
    <CategoriesDesktop
      categories={categories}
      collections={collections}
      countryCode={countryCode}
      isLoading={false}
    />
  );
};

const Hero = async ({ collections: propCollections, countryCode }: HeroProps) => {
  let products: HttpTypes.StoreProduct[] = [];
  let region: HttpTypes.StoreRegion | null = null;

  try {
    const collection = await getCollectionByHandle("popular");
    if (collection?.id) {
      const regionData = await getRegion(countryCode);
      if (regionData?.id) {
        region = regionData;
        const { response } = await getProductsList({
          queryParams: { collection_id: [collection.id], limit: 12 } as ProductListQueryParams,
          countryCode,
        });
        const productIds = response.products.map((p) => p.id!).filter(Boolean);
        if (productIds.length > 0) {
          products = (await getProductsById({
            ids: productIds,
            regionId: regionData.id,
          })) || [];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch popular products in Hero:", error);
    products = [];
  }

  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="flex flex-col lg:flex-row h-full">
        <Suspense
          fallback={
            <CategoriesDesktop
              categories={[]}
              collections={[]}
              countryCode={countryCode}
              isLoading={true}
            />
          }
        >
          <CategoriesDesktopWrapper countryCode={countryCode} />
        </Suspense>

        <div className="w-full lg:w-[88%] flex flex-col h-full">
          <Suspense fallback={<div>Loading...</div>}>
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
  );
};

export default Hero;