import { Metadata } from "next";
// import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import { getCollectionsWithProducts } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";

export const metadata: Metadata = {
  title: "Torgash Store",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
};

export const revalidate = 0;

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string };
}) {
  const collections = await getCollectionsWithProducts(countryCode);
  const region = await getRegion(countryCode);

  console.log("Collections in Home:", collections); // Для отладки

  if (!collections || !region) {
    return (
      <div>
        <p className="text-red-500">No collections or region found</p>
      </div>
    );
  }

  return (
    <>
      <Hero collections={collections} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </>
  );
}