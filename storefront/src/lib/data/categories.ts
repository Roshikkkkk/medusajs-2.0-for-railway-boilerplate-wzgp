import { sdk } from "@lib/config"
import { cache } from "react"

type CacheFunction = <T extends (...args: any[]) => Promise<any>>(fn: T) => T;
const typedCache = cache as CacheFunction;

export const listCategories = typedCache(async function () {
  console.log("listCategories called, backend URL:", process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL);
  try {
    const { product_categories } = await sdk.store.category
      .list({ fields: "+category_children" }, { next: { tags: ["categories"] } });
    console.log("Categories received:", product_categories);
    return product_categories || [];
  } catch (error) {
    console.error("Error in listCategories:", error.message);
    throw new Error(error.message || "Failed to fetch categories");
  }
})

export const getCategoriesList = typedCache(async function (
  offset: number = 0,
  limit: number = 100
) {
  return sdk.store.category.list(
    { limit, offset },
    { next: { tags: ["categories"] } }
  )
})

export const getCategoryByHandle = typedCache(async function (
  categoryHandle: string[]
) {
  return sdk.store.category.list(
    { handle: categoryHandle },
    { next: { tags: ["categories"] } }
  )
})