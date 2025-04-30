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
        <div className="">
          <Button color="primary" as={Link} to="/auth">
            <User size={22} /> Auth
          </Button>
          <hr />
          <Button color="primary" as={Link} to="/auth" className="h-[1000px] ">
            <User size={22} /> Auth
          </Button>
          <hr />
        </div>
      </div>
    </AppsLayout>
  );
};

export default Homepage;
