import { Suspense } from "react";
import HeroSlider from "@modules/home/components/hero-slider";
import MobileGrid from "@modules/home/components/mobile-grid";
import DesktopGrid from "@modules/home/components/desktop-grid";
import { listCategories } from "@lib/data/categories";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";

interface HeroProps {
  collections: HttpTypes.StoreCollection[] | null;
  countryCode: string;
  region: HttpTypes.StoreRegion | null;
}

interface ProductListQueryParams {
  collection_id?: string[];
  limit?: number;
}

const Hero = async ({ collections, countryCode, region }: HeroProps) => {
  const categories = await listCategories();
  let products: HttpTypes.StoreProduct[] = [];

  try {
    const collection = await getCollectionByHandle("popular");
    if (collection?.id && region?.id) {
      const { response } = await getProductsList({
        queryParams: { collection_id: [collection.id], limit: 12 } as ProductListQueryParams,
        countryCode,
      });
      const productIds = response.products?.map((p) => p.id).filter(Boolean) || [];
      if (productIds.length > 0) {
        products = await getProductsById({
          ids: productIds,
          regionId: region.id,
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch popular products in Hero:", error);
  }

  if (!products.length && !categories?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load products or categories</p>
      </div>
    );
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
                    {category.category_children?.length > 0 && (
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
          <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
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