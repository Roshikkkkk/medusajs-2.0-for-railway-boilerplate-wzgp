import { Metadata } from "next";
import Hero from "@modules/home/components/hero";
import { getCollectionsWithProducts } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import { getCollectionByHandle } from "@lib/data/collections";
import { getProductsById, getProductsList } from "@lib/data/products";
import { HttpTypes } from "@medusajs/types";

export const metadata: Metadata = {
  title: "Torgash Store",
  description: "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
};

export const revalidate = 0;

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string };
}) {
  const collections = await getCollectionsWithProducts(countryCode);
  const region = await getRegion(countryCode);

  let products: HttpTypes.StoreProduct[] = [];
  try {
    console.log("Fetching collection with handle 'popular'...");
    const collection = await getCollectionByHandle("popular");
    console.log("Collection fetched:", collection);

    if (collection?.id && region?.id) {
      console.log("Fetching products for collection:", collection.id, "region:", region.id);
      const { response } = await getProductsList({
        queryParams: { collection_id: [collection.id], limit: 20 }, // Увеличил лимит для теста
        countryCode,
      });
      console.log("Products response:", response.products.length);

      const productIds = response.products.map((p) => p.id!).filter(Boolean);
      if (productIds.length > 0) {
        products = await getProductsById({
          ids: productIds,
          regionId: region.id,
        });
        console.log("Fetched products count:", products.length, "IDs:", products.map(p => p.id));
      } else {
        console.log("No products found in collection.");
      }
    } else {
      console.log("No valid collection or region:", { collection, region });
      // Если коллекция не найдена, используем первую доступную
      if (collections && collections.length > 0) {
        const fallbackCollection = collections[0];
        console.log("Falling back to collection:", fallbackCollection.id);
        const { response } = await getProductsList({
          queryParams: { collection_id: [fallbackCollection.id], limit: 20 },
          countryCode,
        });
        const productIds = response.products.map((p) => p.id!).filter(Boolean);
        if (productIds.length > 0) {
          products = await getProductsById({
            ids: productIds,
            regionId: region.id,
          });
          console.log("Fetched fallback products count:", products.length);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching products in Home:", error);
  }

  if (!collections || !region) {
    return (
      <div>
        <p className="text-red-500">No collections or region found</p>
      </div>
    );
  }

  return (
    <>
      <Hero collections={collections} countryCode={countryCode} products={products} region={region} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </>
  );
}