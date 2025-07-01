// page.tsx
import { Metadata } from "next";
import Hero from "@modules/home/components/hero";
import { getCollectionsWithProducts } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import { listCategories } from "@lib/data/categories";
import { HttpTypes } from "@medusajs/types";

export const metadata: Metadata = {
  title: "Torgash Store",
  description: "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
};

export const revalidate = 0;

interface HomeProps {
  params: { countryCode: string };
}

export default async function Home({ params: { countryCode } }: HomeProps) {
  const collections = await getCollectionsWithProducts(countryCode);
  const region = await getRegion(countryCode);
  const categories = await listCategories().catch(() => []);

  if (!collections || !region) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">No collections or region found</p>
      </div>
    );
  }

  return (
    <>
      <Hero
        collections={collections}
        region={region}
        countryCode={countryCode}
        categories={categories}
      />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
        </ul>
      </div>
    </>
  );
}