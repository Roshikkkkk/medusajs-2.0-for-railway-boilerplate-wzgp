import { listCategories } from "@lib/data/categories";

interface CategoriesDesktopProps {
  countryCode: string;
}

const CategoriesDesktop = async ({ countryCode }: CategoriesDesktopProps) => {
  const categories = await listCategories({ cache: "force-cache" }).catch(() => []);

  return (
    <aside className="hidden lg:block w-[220px] border-r border-gray-200">
      <div className="bg-white h-full flex flex-col">
        <div className="p-2 pl-4 flex flex-col gap-1">
          {categories.length > 0 ? (
            categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.handle}`}
                className="w-[195px] h-[28px] rounded flex items-center pl-6 pr-2.5 text-sm font-semibold font-sans text-gray-700 hover:bg-gray-100"
              >
                {category.name}
              </a>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Категорії відсутні</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CategoriesDesktop;