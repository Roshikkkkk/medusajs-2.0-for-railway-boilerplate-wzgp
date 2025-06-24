import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useParams } from "next/navigation";

// Типизация баннера
type Banner = {
  id: string;
  name: string;
  imagePath: string;
  href: string;
};

interface SliderIndicatorsProps {
  banners: Banner[];
  centeredIndex: number;
}

const SliderIndicators: React.FC<SliderIndicatorsProps> = ({ banners, centeredIndex }) => {
  const params = useParams();
  const currentCountryCode = params?.countryCode as string;

  return (
    <div className="flex justify-center items-center h-8 pb-4 max-md:block md:hidden">
      <div className="relative flex justify-center items-center">
        <div
          className={`absolute flex justify-center items-center gap-2 transition-all duration-300 ease-in-out ${
            centeredIndex === banners.length - 1
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          {banners.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === centeredIndex ? "bg-[#007AFF] scale-125" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
        <LocalizedClientLink
          href={`/${currentCountryCode}/banners`}
          className={`flex items-center gap-1 px-5 py-2 bg-[#DEDEE2] text-[#626263] rounded-full text-[15px] font-medium transition-all duration-300 ease-in-out hover:bg-[#D0D0D4] ${
            centeredIndex === banners.length - 1
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          Усі банери
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default SliderIndicators;