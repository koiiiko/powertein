import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout";
import ProteinSearchResult from "./ProteinSearchResult";
import DailyProteinWidget from "./DailyProteinWidget";
import axios from "axios";

import { Input, ToastProvider } from "@heroui/react";

import { Search } from "lucide-react";

const SearchProteinBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const debouncedSearch = useCallback((searchQuery) => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchFood(searchQuery);
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // API call to search food
  const searchFood = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5000/tracker/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch food data");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setLoading(true);
    }

    debouncedSearch(value);
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setQuery(food.namaMakanan);
    setResults([]);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedFood(null);
    setError(null);
  };

  return (
    <div>
      <Input
        type="search"
        startContent={
          <Search className="w-5 h-5 text-gray-300 pointer-events-none flex-shrink-0 mr-1" />
        }
        labelPlacement="outside"
        placeholder="Cari makanan disini!"
        classNames={{
          inputWrapper: [
            "bg-white rounded-xl shadow-sm border border-gray-200 data-[hover=true]:bg-gray-50 group-data-[focus=true]:bg-gray-50",
          ],
          input: [
            "group-data-[has-value=true]:text-gray-600 font-medium text-sm",
            "placeholder:text-gray-400 font-default",
          ],
        }}
        size="lg"
        value={query}
        onChange={handleInputChange}
      />
      {query && !loading && results.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No food items found for "{query}"</p>
        </div>
      )}
      {/* Search result */}
      {results.length > 0 && (
        <div className="flex flex-col mt-6 gap-2">
          {results.map((food, index) => (
            <ProteinSearchResult
              key={index}
              food={food}
              onSelect={() => handleFoodSelect(food)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProteinBar;
