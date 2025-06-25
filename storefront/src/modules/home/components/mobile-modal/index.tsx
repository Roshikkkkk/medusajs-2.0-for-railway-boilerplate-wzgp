"use client";

import React, { useState, useEffect } from "react";
import { listCategories } from "@lib/data/categories";

const MobileModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      listCategories()
        .then((data) => setCategories(data || []))
        .catch((err) => setError("Помилка: " + (err.message || "Невідомо")));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full h-full p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Каталог товарів</h2>
          <button onClick={onClose} className="text-gray-600">
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
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : categories.length > 0 ? (
            <ul>
              {categories.map((cat) => (
                <li key={cat.id} className="py-1">
                  {cat.name || "Без назви"}
                </li>
              ))}
            </ul>
          ) : (
            <p>Завантаження...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileModal;