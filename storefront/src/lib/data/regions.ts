import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"
import { HttpTypes } from "@medusajs/types"

export const listRegions = cache(async function () {
  return sdk.store.region
    .list({}, { next: { tags: ["regions"] } })
    .then(({ regions }) => regions)
    .catch(medusaError)
})

export const retrieveRegion = cache(async function (id: string) {
  return sdk.store.region
    .retrieve(id, {}, { next: { tags: ["regions"] } })
    .then(({ region }) => region)
    .catch(medusaError)
})

export const getRegion = cache(async function (countryCode: string) {
  try {
    const regions = await listRegions()
    if (!regions) {
      return null
    }

    let region: HttpTypes.StoreRegion | undefined;
    regions.forEach((r) => {
      r.countries?.forEach((c) => {
        if (c.iso_2 === countryCode) {
          region = r;
        }
      })
    });

    if (!region) {
      region = regions.find((r) => r.countries?.some((c) => c.iso_2 === "us")) || regions[0];
    }

    console.log("Region for", countryCode, ":", region); // Отладка
    return region;
  } catch (e: any) {
    console.error("Error fetching region:", e);
    return null;
  }
})