// Homepage
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { User } from "lucide-react";
import AppsLayout from "../components/layout";
import axios from "axios";

const Homepage = () => {
  const [userProtein, setUserProtein] = useState(null);

  useEffect(() => {
    console.log("useEffect in Homepage is running");
    const fetchProtein = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/calculator/protein/${userId}`);
          setUserProtein(response.data.protein);
        } catch (error) {
          console.error("Error fetching protein data:", error);
        }
      }
    };
    fetchProtein();
  }, []);

  return (
    <AppsLayout>
      <div className="">
        <h1 className="">Welcome to Powertein</h1>
        {userProtein !== null && (
          <p>Total Protein Yang Perlu Anda Konsumsi Dalam 1 Hari: {userProtein} grams</p>
        )}
      </div>
    </AppsLayout>
  );
};

export default Homepage;
