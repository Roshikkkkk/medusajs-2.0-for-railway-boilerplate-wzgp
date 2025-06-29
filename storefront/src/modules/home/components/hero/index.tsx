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

// Інтерфейс для пропсів Hero
interface HeroProps {
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
}

// Інтерфейс для queryParams у getProductsList
interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
}

const Hero = async ({ collections, countryCode }: HeroProps) => {
  const categories = await listCategories();
  let products: HttpTypes.StoreProduct[] = [];
  let region: HttpTypes.StoreRegion | null = null;

  try {
    console.log("Fetching collection 'popular'...");
    const collection = await getCollectionByHandle("popular");
    console.log("Collection 'popular' fetched:", collection);

    if (collection?.id) {
      const regionData = await getRegion(countryCode);
      if (regionData?.id) {
        region = regionData;
        console.log("Fetching products with limit 20...");
        const { response } = await getProductsList({
          queryParams: { collection_id: [collection.id], limit: 20 } as ProductListQueryParams,
          countryCode,
        });
        console.log("Products response length:", response.products.length);

        const productIds = response.products.map((p) => p.id!).filter(Boolean);
        if (productIds.length > 0) {
          products = await getProductsById({
            ids: productIds,
            regionId: regionData.id,
          });
          console.log("Fetched products count:", products.length);
        } else {
          console.log("No products in 'popular', using fallback...");
          if (collections && collections.length > 0) {
            const fallbackCollection = collections[0];
            const { response: fallbackResponse } = await getProductsList({
              queryParams: { collection_id: [fallbackCollection.id], limit: 20 },
              countryCode,
            });
            const fallbackIds = fallbackResponse.products.map((p) => p.id!).filter(Boolean);
            if (fallbackIds.length > 0) {
              products = await getProductsById({
                ids: fallbackIds,
                regionId: regionData.id,
              });
              console.log("Fallback products count:", products.length);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch popular products in Hero:", error);
  }

  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="flex flex-col lg:flex-row min-h-[75vh]">
        <aside className="hidden lg:block w-[15%] border-r border-ui-border-base p-2 pt-4 pl-10">
          <div className="h-full">
            {categories && categories.length > 0 ? (
              <ul className="grid grid-cols-1 gap-1 category-text">
                {categories.map((category) => (
                  <li key={category.id} className="flex flex-col gap-1">
                    <a
                      href={`/category/${category.handle}`}
                      className={clx(
                        "hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-1 py-0.5",
                        category.category_children?.length > 0 && "font-semibold"
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
                                className="hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-large px-1 py-0.5"
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

        <div className="w-full lg:w-[85%] flex flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            <HeroSlider />
            <MobileGrid
              className="md:hidden"
              collections={collections}
              countryCode={countryCode}
              products={products}
              region={region}
            />
            <DesktopGrid className="hidden md:block" />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Hero;