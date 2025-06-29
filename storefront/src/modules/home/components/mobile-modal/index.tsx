"use client";

import React, { useState, useEffect } from "react";
import { listCategories } from "@lib/data/categories";
import Nav from "../modal-nav";

// Define category type
interface Category {
  id?: string;
  name: string;
  handle: string;
}

// Define props interface
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileModal = ({ isOpen, onClose }: MobileModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      listCategories()
        .then((data: Category[]) => {
          setCategories(data || []);
          setError(null);
        })
        .catch((err: Error) => {
          setError(`Помилка: ${err.message || "Невідомо"}`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-blue-600 flex items-start justify-start overflow-hidden">
      <div className="w-screen h-screen">
        <Nav onClose={onClose} />
        <div className="bg-gray-100 overflow-y-auto h-full">
          {isLoading ? (
            <p className="text-center">Звантаження...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : categories.length > 0 ? (
            <ul className="p-0 pl-4">
              {categories.map((cat) => (
                <li key={cat.id ?? Math.random()} className="py-1">
                  <a href={`/category/${cat.handle}`} className="text-lg">{cat.name ?? "Без назви"}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">Немає категорій</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileModal;