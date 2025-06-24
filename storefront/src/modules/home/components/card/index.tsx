import { useState } from "react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

// Типизация баннера
type Banner = {
  id: string;
  name: string;
  imagePath: string;
  href: string;
};

// Типизация пропсов карточки
interface CardProps {
  banner: Banner;
  isCentered?: boolean;
}

// Компонент карточки
const Card: React.FC<CardProps> = ({ banner, isCentered = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <LocalizedClientLink
      href={banner.href}
      className={`w-[350px] h-[200px] md:w-[800px] md:h-[300px] snap-center flex-shrink-0 rounded-[20px] flex flex-col items-center justify-end bg-cover bg-center relative overflow-hidden transition-transform duration-300 ${
        isCentered ? "scale-105" : ""
      }`}
      style={{
        backgroundImage: `url(${banner.imagePath})`,
        backgroundColor: banner.imagePath ? "transparent" : "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
      onClick={handleClick}
    >
      {/* Кнопка-стрелка (только на мобилке) */}
      <button
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out max-md:flex md:hidden ${
          isCentered
            ? "bg-[#DEDEE2] text-[#626263] hover:bg-[#D0D0D4]"
            : "bg-[#ECECEE] text-[#B8B8B9]"
        } ${isLoading ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
      >
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
      </button>

      {/* Лоадер (только на мобилке, в правом верхнем углу) */}
      {isLoading && (
        <div
          className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-all duration-300 ease-in-out max-md:block md:hidden ${
            isLoading ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        >
          <div className="w-6 h-6 relative">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[2px] h-1 bg-[#DEDEE2] rounded-[1px]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 30}deg) translateY(-8px)`,
                  opacity: 0.25 + (i / 12) * 0.75,
                  animation: `ios-spinner 1s linear infinite`,
                  animationDelay: `${(i * -0.0833).toFixed(3)}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Встроенные стили для анимации лоадера */}
      <style jsx>{`
        @keyframes ios-spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.25;
          }
        }
      `}</style>
    </LocalizedClientLink>
  );
};

export default Card;