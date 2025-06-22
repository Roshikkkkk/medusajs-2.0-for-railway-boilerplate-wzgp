import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { listCategories } from "@lib/data/categories"
import { clx } from "@medusajs/ui"

const Hero = async () => {
  // Запрашиваем категории
  const categories = await listCategories()

  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="content-container mx-auto flex flex-col lg:flex-row min-h-[75vh]">
        {/* Левая часть (15%) для категорий и фильтров, только на десктопе */}
        <aside className="hidden lg:block w-[15%] border-r border-ui-border-base p-4">
          <div className="h-full">
            {/* Дерево категорий */}
            {categories && categories.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 text-base text-gray-800">
                {categories.map((category) => (
                  <li key={category.id} className="flex flex-col gap-2">
                    <a
                      href={`/category/${category.handle}`}
                      className={clx(
                        "hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-2 py-1",
                        category.category_children?.length > 0 && "text-lg font-medium"
                      )}
                      data-testid="category-link"
                    >
                      {category.name}
                    </a>
                    {/* Дочерние категории, если есть */}
                    {category.category_children && category.category_children.length > 0 && (
                      <ul className="grid grid-cols-1 gap-2 ml-3">
                        {category.category_children.map((child) => (
                          <li key={child.id}>
                            <a
                              href={`/category/${child.handle}`}
                              className="text-base hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-2 py-1"
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
              <p className="text-base text-gray-800">No categories found</p>
            )}
          </div>
        </aside>

        {/* Правая часть (85%) для товаров */}
        <div className="w-full lg:w-[85%] flex flex-col justify-center items-center text-center p-4 small:p-32 gap-6">
          <span>
            {/* Существующий контент Hero, пока пустой */}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Hero