import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";

interface CategoriesDesktopProps {
  categories: any[];
  collections: HttpTypes.StoreCollection[];
  countryCode: string;
  isLoading: boolean;
}

const CategoriesDesktop = ({ categories, collections, countryCode, isLoading }: CategoriesDesktopProps) => {
  return (
    <aside className="hidden lg:block w-[12%] border-r border-gray-200">
      <div className="bg-white p-0 h-full">
        <div className="py-2 pl-4 pr-2">
          {isLoading ? (
            <div className="w-20 h-6 bg-gray-200 animate-pulse rounded mt-2 mb-2"></div>
          ) : (
            <h2 className="text-base font-semibold text-gray-800 mt-2 mb-2" style={{ color: '#2b2926' }}>
              Категорії
            </h2>
          )}
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="p-2 pl-4">
          {isLoading ? (
            <ul className="grid grid-cols-1 gap-0.5">
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <li key={index} className="flex flex-col gap-0.25">
                    <div className="w-[80%] h-6 bg-gray-200 animate-pulse rounded px-2 py-1 mb-0.5"></div>
                    <ul className="grid grid-cols-1 gap-0.25 ml-6">
                      {Array(2)
                        .fill(null)
                        .map((_, childIndex) => (
                          <li key={childIndex}>
                            <div className="w-[70%] h-5 bg-gray-200 animate-pulse rounded px-2 py-0.5"></div>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
            </ul>
          ) : categories && categories.length > 0 ? (
            <ul className="grid grid-cols-1 gap-0.5">
              {categories.map((category) => (
                <li key={category.id} className="flex flex-col gap-0.25">
                  <a
                    href={`/category/${category.handle}`}
                    className={clx(
                      "text-sm font-medium text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-2 py-1",
                      category.category_children?.length > 0 && "font-medium"
                    )}
                    style={{ color: '#2b2926' }}
                    data-testid="category-link"
                  >
                    {category.name}
                  </a>
                  {category.category_children && category.category_children.length > 0 && (
                    <ul className="grid grid-cols-1 gap-0.25 ml-6">
                      {category.category_children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`/category/${child.handle}`}
                            className={clx(
                              "text-xs font-normal text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-2 py-0.5"
                            )}
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
            <p className="text-gray-500">No categories found</p>
          )}
        </div>
        <div className="py-2 pl-4 pr-2">
          {isLoading ? (
            <div className="w-20 h-6 bg-gray-200 animate-pulse rounded mt-2 mb-2"></div>
          ) : (
            <h2 className="text-base font-semibold text-gray-800 mt-2 mb-2" style={{ color: '#2b2926' }}>
              Колекції
            </h2>
          )}
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="p-2 pl-4">
          {isLoading ? (
            <ul className="grid grid-cols-1 gap-0.5">
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <li key={index} className="flex flex-col gap-0.25">
                    <div className="w-[85%] h-6 bg-gray-200 animate-pulse rounded px-2 py-1 mb-0.5"></div>
                  </li>
                ))}
            </ul>
          ) : collections && collections.length > 0 ? (
            <ul className="grid grid-cols-1 gap-0.5">
              {collections.map((collection) => (
                <li key={collection.id} className="flex flex-col gap-0.25">
                  <a
                    href={`/collections/${collection.handle}`}
                    className={clx(
                      "text-sm font-medium text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-2 py-1"
                    )}
                    style={{ color: '#2b2926' }}
                    data-testid="collection-link"
                  >
                    {collection.title || collection.handle}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No collections found</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CategoriesDesktop;