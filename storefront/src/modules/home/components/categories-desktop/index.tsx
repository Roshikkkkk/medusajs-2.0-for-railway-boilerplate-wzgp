"use client";

import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";

interface CategoriesDesktopProps {
  categories: any[];
  collections: HttpTypes.StoreCollection[];
  countryCode: string;
}

const CategoriesDesktop = ({ categories, collections, countryCode }: CategoriesDesktopProps) => {
  return (
    <aside className="hidden lg:block w-[12%] border-r border-gray-200">
      <div className="bg-white p-0 h-full">
        {/* Плашка для заголовка "Категорії" с полоской */}
        <div className="py-2 pl-4 pr-2">
          <h2 className="text-base font-semibold text-gray-800 mt-2 mb-2" style={{ color: '#2b2926' }}>
            Категорії
          </h2>
        </div>
        <div className="border-t border-gray-200"></div>
        {/* Список категорий */}
        <div className="p-2 pl-4">
          {categories && categories.length > 0 ? (
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
                  {category.category_children &&
                    category.category_children.length > 0 && (
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
        {/* Плашка для "Колекції" с полоской */}
        <div className="py-2 pl-4 pr-2">
          <h2 className="text-base font-semibold text-gray-800 mt-2 mb-2" style={{ color: '#2b2926' }}>
            Колекції
          </h2>
        </div>
        <div className="border-t border-gray-200"></div>
        {/* Список коллекций */}
        <div className="p-2 pl-4">
          {collections && collections.length > 0 ? (
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