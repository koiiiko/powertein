// Homepage
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { User } from "lucide-react";
import AppsLayout from "../components/layout";

const Homepage = () => {
  return (
    <AppsLayout>
      <div className="">
        <h1 className="">Welcome to Powertein</h1>
      </div>
    </AppsLayout>
  );
};

export default Homepage;
