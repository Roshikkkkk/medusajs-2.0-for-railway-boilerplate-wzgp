import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="container mx-auto flex flex-col lg:flex-row min-h-[75vh]">
        {/* Левая часть (15%) для категорий и фильтров, только на десктопе */}
        <aside className="hidden lg:block w-[15%] border-r border-ui-border-base p-4">
          {/* Пустой контейнер для дерева категорий и фильтров */}
          <div className="h-full">
            {/* Здесь будет дерево категорий и фильтры */}
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