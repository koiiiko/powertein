// import { Link, useLocation } from "react-router-dom";
// import React, { useState } from 'react';
// import {
//   Calculator,
//   NotebookPen,
//   ShoppingCart,
//   Newspaper,
//   Bot,
//   User,
//   LogOut,
//   ChevronUp
// } from "lucide-react";
// import {
//   Card,
//   CardBody,
//   Button
// } from '@heroui/react';

// const AppsLayout = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const token = localStorage.getItem('authToken');

//   const handleLogout = async () => {
//     setLoading(true);

//     try {
//       // Call logout API
//       await fetch('http://localhost:5000/auth/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       // Remove token and user data from localStorage
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Even if API fails, still logout locally
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     } finally {
//       setLoading(false);
//     }
//   };

//   const location = useLocation(); // <--- pakai ini untuk cek path aktif

//   return (
//     <div className="grid grid-cols-12 h-screen">
//       {/* Sidebar */}
//       <aside className="col-span-2 flex flex-col overflow-y-auto overflow-x-hidden text-center bg-[#F1F4F9]">
//         <a href="/">
//           <h1 className="font-semibold text-gray-800 my-5 md:text-3xl">PowerTein</h1>
//         </a>
//         {/* Sidebar Menu */}
//         <nav className="flex flex-col gap-3 text-left mx-3">
//           <Link
//             to="/calculator"
//             className={`${location.pathname === "/calculator"
//               ? "text-[#45556C] bg-white font-bold"
//               : "text-[#91A1BA]"
//               } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
//           >
//             <Calculator className="me-3" />
//             Protein Calculator
//           </Link>

//           <Link
//             to="/tracker" // Assuming a route for Protein Tracker
//             className={`${location.pathname === "/"
//               ? "text-[#45556C] bg-white font-bold"
//               : "text-[#91A1BA]"
//               } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
//           >
//             <NotebookPen className="me-3" />
//             Protein Tracker
//           </Link>

//           <Link
//             to="/mart" // Assuming a route for ProteinMart
//             className={`${location.pathname === "/"
//               ? "text-[#45556C] bg-white font-bold"
//               : "text-[#91A1BA]"
//               } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
//           >
//             <ShoppingCart className="me-3" />
//             ProteinMart
//           </Link>

//           <Link
//             to="/forum"
//             className={`${location.pathname.startsWith("/forum")
//               ? "text-[#45556C] bg-white font-bold"
//               : "text-[#91A1BA]"
//               } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
//           >
//             <Newspaper className="me-3" />
//             ProteinPedia
//           </Link>

//           <Link
//             to="/bot" // Assuming a route for ProteinBot
//             className={`${location.pathname === "/"
//               ? "text-[#45556C] bg-white font-bold"
//               : "text-[#91A1BA]"
//               } hover:text-gray-900 p-2 flex md:text-[14px] rounded-lg`}
//           >
//             <Bot className="me-3" />
//             ProteinBot
//           </Link>
//         </nav>

//         {/* Sidebar User Info */}
//         <button className="flex items-center mt-auto my-8 mx-5" onClick={() => setIsOpen(!isOpen)}>
//           <div className="flex flex-col text-left text-gray-500 hover:text-gray-900 ">
//             <p className="font-semibold md:text-[14px]">{user.username}</p>
//             <p className="md:text-xs">{user.email}</p>
//           </div>
//           <ChevronUp size={16} className={`mx-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//         </button>

//         {
//           isOpen && (
//             <div className="flex mx-3 mt-[-20px]">
//               <div className="flex flex-col text-left mb-5 hover:text-gray-900 ">
//                 {/* Profile Option */}
//                 <a
//                   href="#"
//                   className="flex items-center space-x-3 w-full p-2 text-left transition-colors"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <User className="w-4 h-4 text-gray-500" />
//                   <span className="text-sm">Profile</span>
//                 </a>
//                 {/* Logout Option */}
//                 <button
//                   onClick={handleLogout}
//                   disabled={loading}
//                   className="flex items-center space-x-3 w-full p-2 text-left transition-colors disabled:opacity-50"
//                 >
//                   <LogOut className="w-4 h-4 text-gray-500" />
//                   <span className="text-sm">
//                     {loading ? 'Logging out...' : 'Log Out'}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           )
//         }
//       </aside >

//       {/* Content */}
//       < main className="col-span-10 overflow-y-auto p-6" > {children}</main >
//     </div >
//   );
// };

// export default AppsLayout;

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function AppsLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0 border-r bg-gray-50/40">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </div>
      <main className="flex-1 overflow-auto px-4 py-8">{children}</main>
    </div>
  );
}
