import { sdk } from "@lib/config"
import { cache } from "react"

// Явно указываем тип для cache, чтобы убрать ошибку TypeScript
type CacheFunction = <T extends (...args: any[]) => Promise<any>>(fn: T) => T;
const typedCache = cache as CacheFunction;

export const listCategories = typedCache(async function () {
  return sdk.store.category
    .list({ fields: "+category_children" }, { next: { tags: ["categories"] } })
    .then(({ product_categories }) => product_categories)
})

export const getCategoriesList = typedCache(async function (
  offset: number = 0,
  limit: number = 100
) {
  return sdk.store.category.list(
    // TODO: Look into fixing the type
    // @ts-ignore
    { limit, offset },
    { next: { tags: ["categories"] } }
  )
})

export const getCategoryByHandle = typedCache(async function (
  categoryHandle: string[]
) {
  return sdk.store.category.list(
    // TODO: Look into fixing the type
    // @ts-ignore
    { handle: categoryHandle },
    { next: { tags: ["categories"] } }
  )
})