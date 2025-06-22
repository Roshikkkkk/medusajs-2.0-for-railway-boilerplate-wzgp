import { Suspense } from "react"
import HeroSlider from "@modules/home/components/hero-slider"
import { listCategories } from "@lib/data/categories"
import { clx } from "@medusajs/ui"

const Hero = async () => {
  // Запрашиваем категории
  const categories = await listCategories()

  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="flex flex-col lg:flex-row min-h-[75vh]">
        {/* Левая часть (15%) для категорий и фильтров, только на десктопе */}
        <aside className="hidden lg:block w-[15%] border-r border-ui-border-base p-2 pt-4">
          <div className="h-full">
            {/* Дерево категорий */}
            {categories && categories.length > 0 ? (
              <ul className="grid grid-cols-1 gap-1 category-text">
                {categories.map((category) => (
                  <li key={category.id} className="flex flex-col gap-1">
                    <a
                      href={`/category/${category.handle}`}
                      className={clx(
                        "hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md px-1 py-0.5",
                        category.category_children?.length > 0 && "font-semibold"
                      )}
                      data-testid="category-link"
                    >
                      {category.name}
                    </a>
                    {/* Дочерние категории, если есть */}
                    {category.category_children && category.category_children.length > 0 && (
                      <ul className="grid grid-cols-1 gap-1 ml-1.5">
                        {category.category_children.map((child) => (
                          <li key={child.id}>
                            <a
                              href={`/category/${child.handle}`}
                              className="hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-large px-1 py-0.5"
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
              <p className="category-text">No categories found</p>
            )}
          </div>
        </aside>

        {/* Правая часть (85%) для слайдера */}
        <div className="w-full lg:w-[85%] flex flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            <HeroSlider />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Hero