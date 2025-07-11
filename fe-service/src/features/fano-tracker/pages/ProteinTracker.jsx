import React, { useState, useEffect } from "react";
import Layout from "@/components/layout";
import axios from "axios";
import SearchProteinBar from "../components/SearchProteinBar";
import DailyProteinWidget from "../components/DailyProteinWidget";
import HistoryProteinWidget from "../components/HistoryProteinWidget";

import {
  Input,
  Progress,
  Chip,
  Select,
  SelectSection,
  SelectItem,
} from "@heroui/react";
import { Search } from "lucide-react";

export const periods = [
  { key: "1", label: "Kemarin" },
  { key: "3", label: "3 hari lalu" },
  { key: "7", label: "7 hari lalu" },
  { key: "30", label: "1 bulan lalu" },
];

const ProteinTracker = () => {
  const [userProtein, setUserProtein] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    console.log("useEffect in Homepage is running");
    const fetchProtein = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/calculator/protein/${userId}`
          );
          setUserProtein(response.data.protein);
        } catch (error) {
          console.error("Error fetching protein data:", error);
        }
      }
    };
    fetchProtein();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center mx-auto pt-12 p-72 gap-12">
        <div className="flex flex-col gap-6 bg-white w-full rounded-2xl font-semibold">
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-2xl text-gray-700 font-medium">
              Catat konsumsi makanan Anda ️️✍️
            </p>
            <p className="text-2xl text-gray-700 font-medium">
              📊 Pantau pemenuhan protein harian Anda
            </p>
          </div>
          <SearchProteinBar />
        </div>
        <div className="w-full">
          <DailyProteinWidget />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <HistoryProteinWidget />
        </div>
      </div>
    </Layout>
  );
};

export default ProteinTracker;
