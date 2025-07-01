// CategoriesDesktop.jsx
"use client";

interface CategoriesDesktopProps {
  countryCode: string;
  categories: any[];
}

const CategoriesDesktop = ({ categories }: CategoriesDesktopProps) => {
  return (
    <aside className="hidden lg:block w-[220px] border-r border-gray-200">
      <div className="h-full flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="p-2 pl-4 flex flex-col gap-1 h-full overflow-y-auto">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.id}`}
              className="w-[195px] h-[28px] rounded flex items-center pl-6 pr-2.5 text-sm font-semibold font-sans text-gray-700 hover:bg-gray-100"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CategoriesDesktop;