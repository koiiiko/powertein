// Homepage
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { User } from "lucide-react";

const Homepage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Powertein</h1>
      <div className="flex gap-4">
        <Button color="primary" as={Link} to="/auth">
          <User size={22}/> Auth
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
