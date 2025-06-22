import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { listCategories } from "@lib/data/categories"

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
              <ul className="text-base">
                {categories.map((category) => (
                  <li key={category.id} className="py-1">
                    <a href={`/category/${category.handle}`} className="hover:text-ui-fg-base">
                      {category.name}
                    </a>
                    {/* Дочерние категории, если есть */}
                    {category.category_children && category.category_children.length > 0 && (
                      <ul className="ml-4">
                        {category.category_children.map((child) => (
                          <li key={child.id} className="py-1">
                            <a href={`/category/${child.handle}`} className="hover:text-ui-fg-base">
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
              <p className="text-base text-ui-fg-subtle">No categories found</p>
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