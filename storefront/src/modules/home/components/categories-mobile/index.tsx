"use client";

import React, { useState, useEffect } from "react";
import { listCategories } from "@lib/data/categories";

export default function CategoriesMobile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      listCategories()
        .then((data) => {
          console.log("Categories:", data);
          setCategories(data || []);
        })
        .catch((err) => {
          console.error("Error:", err);
          setError("Помилка: " + (err.message || "Перевірте сервер"));
        });
    }
  }, [isModalOpen]);

  const toggleModal = () => {
    console.log("Button clicked");
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        onTouchStart={toggleModal} // Для мобильных
        className="w-full h-16 flex items-center justify-between px-4 bg-gray-100 text-gray-900 rounded-md text-base font-medium focus:outline-none"
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex items-center">
          <img src="/icons/categories.svg" alt="Categories" className="w-5 h-5 mr-2" />
          <span>Каталог товарів</span>
        </div>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Каталог товарів</h2>
              <button onClick={toggleModal} className="text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : categories.length > 0 ? (
              <ul>
                {categories.map((cat) => (
                  <li key={cat.id || Math.random()} className="py-1">
                    {cat.name || "Без назви"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Завантаження...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}