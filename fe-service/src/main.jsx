import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import router from './router';
import "@/components/ui/index.css";
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  </React.StrictMode>
);
