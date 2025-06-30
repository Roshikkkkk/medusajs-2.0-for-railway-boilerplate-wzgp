import { Suspense } from "react";
import HeroSlider from "@modules/home/components/hero-slider";
import MobileGrid from "@modules/home/components/mobile-grid";
import DesktopGrid from "@modules/home/components/desktop-grid";
import { listCategories } from "@lib/data/categories";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";

// Интерфейс для пропсов Hero
interface HeroProps {
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
}

// Интерфейс для queryParams в getProductsList
interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
}

const Hero = async ({ collections, countryCode }: HeroProps) => {
  let categories: any[] = []; // Fallback to empty array
  try {
    categories = (await listCategories()) || []; // Ensure categories is an array
  } catch (error) {
    console.error("Failed to fetch categories in Hero:", error);
  }

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
        <aside className="hidden lg:block w-[12%] border-r border-ui-border-base p-2 pt-4 pl-10">
          <div className="h-full">
            {categories && categories.length > 0 ? (
              <ul className="grid grid-cols-1 gap-1 category-text">
                {categories.map((category) => (
                  <li key={category.id} className="flex flex-col gap-1">
                    <a
                      href={`/category/${category.handle}`}
                      className={clx(
                        "hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-1 py-0.5 font-semibold", // Changed to font-semibold
                        category.category_children?.length > 0 && "font-semibold" // Kept for consistency, though redundant now
                      )}
                      data-testid="category-link"
                    >
                      {category.name}
                    </a>
                    {category.category_children &&
                      category.category_children.length > 0 && (
                        <ul className="grid grid-cols-1 gap-1">
                          {category.category_children.map((child) => (
                            <li key={child.id}>
                              <a
                                href={`/category/${child.handle}`}
                                className={clx(
                                  "hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-large px-1 py-0.5 font-semibold" // Changed to font-semibold
                                )}
                                data-testid="category-link"
                              >
                                {child.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="category-text">No categories found</p>
            )}
          </div>
        </aside>

        <div className="w-full lg:w-[88%] flex flex-col h-full">
          <Suspense fallback={<div>Loading...</div>}>
            <HeroSlider className="md:hidden" />
            <MobileGrid
              className="md:hidden"
              collections={collections}
              countryCode={countryCode}
              products={products}
              region={region}
            />
            <DesktopGrid
              className="hidden md:block h-full"
              collections={collections}
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