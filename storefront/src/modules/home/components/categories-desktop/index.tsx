import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { listCategories } from "@lib/data/categories";
import { getCollectionsList } from "@lib/data/collections";

const CategoriesDesktopContent = async ({ countryCode }: { countryCode: string }) => {
  const [categories, { collections }] = await Promise.all([
    listCategories({ cache: "force-cache" }).catch(() => []),
    getCollectionsList(0, 10, { cache: "force-cache" }).catch(() => ({ collections: [] })),
  ]);

  return (
    <>
      <div className="py-2 px-4">
        <h2 className="text-base font-semibold" style={{ color: '#2b2926' }}>
          Категорії
        </h2>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="p-2 pl-4">
        {categories.length > 0 ? (
          <ul className="grid grid-cols-1 gap-0.5">
            {categories.map((category) => (
              <li key={category.id} className="flex flex-col gap-0.25">
                <a
                  href={`/category/${category.handle}`}
                  className="text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1"
                  style={{ color: '#2b2926' }}
                  data-testid="category-link"
                >
                  {category.name}
                </a>
                {category.category_children?.length > 0 && (
                  <ul className="grid grid-cols-1 gap-0.25 ml-6">
                    {category.category_children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`/category/${child.handle}`}
                          className="text-xs font-normal text-gray-600 hover:bg-gray-100 rounded-md px-2 py-0.5"
                          style={{ color: '#2b2926' }}
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
          <p className="text-gray-500">Категорії відсутні</p>
        )}
      </div>
      <div className="py-2 px-4">
        <h2 className="text-base font-semibold" style={{ color: '#2b2926' }}>
          Колекції
        </h2>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="p-2 pl-4">
        {collections.length > 0 ? (
          <ul className="grid grid-cols-1 gap-0.5">
            {collections.map((collection) => (
              <li key={collection.id} className="flex flex-col gap-0.25">
                <a
                  href={`/collections/${collection.handle}`}
                  className="text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1"
                  style={{ color: '#2b2926' }}
                  data-testid="collection-link"
                >
                  {collection.title || collection.handle}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Колекції відсутні</p>
        )}
      </div>
    </>
  );
};

interface CategoriesDesktopProps {
  countryCode: string;
}

const CategoriesDesktop = ({ countryCode }: CategoriesDesktopProps) => {
  return (
    <aside className="hidden lg:block w-[12%] border-r border-gray-200">
      <div className="bg-white h-full">
        <CategoriesDesktopContent countryCode={countryCode} />
      </div>
    </aside>
  );
};

export default CategoriesDesktop;