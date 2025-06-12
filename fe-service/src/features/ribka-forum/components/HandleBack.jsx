
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ to = "/forum" }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleBack}
      className="group flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 
                 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300
                 rounded-lg transition-all duration-200 ease-out
                 shadow-sm hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transform hover:scale-105 active:scale-95
                 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/0 via-gray-50/50 to-gray-50/0 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      
      <ArrowLeft 
        size={20} 
        className="transition-all duration-200 group-hover:scale-110 group-hover:-translate-x-1 relative z-10" 
      />

      
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 
                      scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center
                      rounded-r-full"></div>
    </button>
  );
};

export default BackButton;