import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Calculator,
  NotebookPen,
  ShoppingCart,
  Newspaper,
  Bot,
  ChevronRight,
} from "lucide-react";

const AppsLayout = ({ children }) => {
  const [activeLink, setActiveLink] = useState("");
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };
  return (
    <div className="grid grid-cols-12 h-screen">
      {/* Sidebar */}
      <aside className="col-span-2 flex flex-col overflow-y-auto overflow-x-hidden text-center bg-[#F1F4F9] ">
        <h1 className="font-semibold text-gray-800 my-5 md:text-3xl ">
          PowerTein
        </h1>
        {/* Sidebar Menu */}
        <nav className="flex flex-col gap-3 text-left mx-3">
          <Link
            to="/"
            className={`${activeLink === "protein-calculator"
              ? "text-[#45556C] bg-white font-bold"
              : "text-[#91A1BA]"
              } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
            onClick={() => handleLinkClick("protein-calculator")}
          >
            <Calculator className="me-3" />
            Protein Calculator
          </Link>
          <Link
            to="/"
            className={`${activeLink === "protein-tracker"
              ? "text-[#45556C] bg-white font-bold"
              : "text-[#91A1BA]"
              } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
            onClick={() => handleLinkClick("protein-tracker")}
          >
            <NotebookPen className="me-3" />
            Protein Tracker
          </Link>
          <Link
            to="/"
            className={`${activeLink === "proteimart"
              ? "text-[#45556C] bg-white font-bold"
              : "text-[#91A1BA]"
              } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
            onClick={() => handleLinkClick("proteimart")}
          >
            <ShoppingCart className="me-3" />
            ProteinMart
          </Link>
          <Link
            to="/forum"
            className={`${activeLink === "proteinpedia"
              ? "text-[#45556C] bg-white font-bold"
              : "text-[#91A1BA]"
              } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
            onClick={() => handleLinkClick("proteinpedia")}
          >
            <Newspaper className="me-3" />
            ProteinPedia
          </Link>
          <Link
            to="/"
            className={`${activeLink === "proteinbot"
              ? "text-[#45556C] bg-white font-bold"
              : "text-[#91A1BA]"
              } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
            onClick={() => handleLinkClick("proteinbot")}
          >
            <Bot className="me-3" />
            ProteinBot
          </Link>
        </nav>
        {/* Sidebar User Info */}
        <div className="flex items-center mt-auto my-8 mx-5">
          <div className="flex flex-col text-left text-gray-500">
            <p className="font-semibold text-gray-700 md:text-[14px]">Mike Den</p>
            <p className="md:text-xs">mike.den@example.com</p>
          </div>
          <Link
            to="/"
            className={`${activeLink === "profile"
              ? "text-[#45556C] font-bold"
              : "text-[#91A1BA]"
              } hover:text-gray-950  ms-auto rounded-lg`}
            onClick={() => handleLinkClick("profile")}
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="col-span-10 overflow-y-auto p-6">{children}</main>
    </div>
  );
};

export default AppsLayout;
