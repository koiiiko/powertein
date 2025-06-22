import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryProteinDetails from "../components/HistoryProteinDetails";

import { Chip, Button, Select, SelectItem } from "@heroui/react";
import { Check, ChevronRight, CircleAlert } from "lucide-react";

export const periods = [
  { key: "1", label: "Kemarin" },
  { key: "3", label: "3 hari lalu" },
  { key: "7", label: "7 hari lalu" },
  { key: "30", label: "1 bulan lalu" },
];

const HistoryProteinWidget = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const [historyData, setHistoryData] = useState([]);
  const [userProtein, setUserProtein] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/tracker/history/${selectedPeriod}?userId=${userId}`
      );
      setHistoryData(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, selectedPeriod]);

  const handlePeriodChange = (keys) => {
    setSelectedPeriod(Array.from(keys)[0]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div>
      <div className="flex flex-row w-full items-center mb-6">
        <p className="w-full text-left font-medium text-xl text-gray-600">
          Riwayat Konsumsi Protein
        </p>
        <Select
          className="w-48"
          size="md"
          defaultSelectedKeys={["1"]}
          onSelectionChange={handlePeriodChange}
        >
          {periods.map((period) => (
            <SelectItem className="w-full text-gray-600" key={period.key}>
              {period.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {historyData.map((record, index) => {
            const totalProtein = parseFloat(record.totalProtein) || 0;
            const isComplete = totalProtein >= userProtein;

            return (
              <div
                key={index}
                className="flex flex-row w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm items-center"
              >
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-base font-medium text-gray-700">
                    {formatDate(record.date)}
                  </p>
                  <div className="flex flex-row w-full gap-3 items-center">
                    <Chip
                      size="sm"
                      className={`font-default gap-1 ${
                        isComplete
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                      startContent={
                        isComplete ? (
                          <Check size={14} />
                        ) : (
                          <CircleAlert size={14} />
                        )
                      }
                    >
                      {isComplete
                        ? "Memenuhi kebutuhan harian"
                        : "Kurang dari kebutuhan"}
                    </Chip>
                    <p className="text-xs font-medium text-gray-500">
                      Total Protein: {totalProtein.toFixed(1)}g
                    </p>
                  </div>
                </div>
                <HistoryProteinDetails userId={userId} date={record.date} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryProteinWidget;
