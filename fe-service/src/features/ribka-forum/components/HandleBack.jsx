// BackButton.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ to = "/forum", label = "Kembali" }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <ArrowLeft size={20} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;