import { useEffect, useState } from "react";
import axios from "axios";
import AppsLayout from "../../../components/layout";
import BackButton from "../components/HandleBack";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
  PenTool,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ← TAMBAH
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ← TAMBAH
  const [articleToDelete, setArticleToDelete] = useState(null); // ← TAMBAH
  const [isDeleting, setIsDeleting] = useState(false); // ← TAMBAH
  const [errorMessage, setErrorMessage] = useState(""); // ← TAMBAH

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/forum/articles"
        );
        const filtered = response.data.filter(
          (article) => article.user_id === userId
        );
        console.log("Artikel saya:", filtered);
        setArticles(filtered);
      } catch (error) {
        console.error("Gagal mengambil artikel saya:", error);
      }
    };

    if (userId) {
      fetchMyArticles();
    } else {
      console.log("User belum login atau user ID tidak ditemukan.");
    }
  }, [userId]);

  // ← UBAH: Function untuk show delete confirmation
  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  // ← TAMBAH: Function untuk cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
    setErrorMessage("");
  };

  // ← UBAH: Function untuk confirm delete
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await axios.delete(
        `http://localhost:5000/forum/articles/${articleToDelete.id}`
      );

      // Update state dengan menghapus artikel dari array
      setArticles(
        articles.filter((article) => article.id !== articleToDelete.id)
      );

      // Tutup modal delete dan tampilkan success
      setShowDeleteModal(false);
      setShowSuccessModal(true);

      // Auto close success modal setelah 2 detik
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting article:", error);
      setErrorMessage("Gagal menghapus artikel. Coba lagi.");
    } finally {
      setIsDeleting(false);
      setArticleToDelete(null);
    }
  };

  return (
    <AppsLayout>
      <div className="max-w-none mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">Artikel Saya</h1>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <FileText size={32} className="text-blue-500" />
            </div>

            {/* Header */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Belum Ada Artikel
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-center mb-8 max-w-lg leading-relaxed">
              Mulai buat artikel pertama anda!
            </p>

            <button
              onClick={() => navigate("/forum/new")}
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PenTool
                size={20}
                className="mr-3 group-hover:rotate-12 transition-transform duration-200"
              />
              Buat Artikel Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/forum/${article.id}`)}
                className="group bg-white rounded-xl shadow-md p-5 flex items-center justify-between 
                     hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 ease-out 
                     cursor-pointer border border-gray-100 hover:border-blue-200 
                     transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-white hover:to-blue-50/30
                     relative overflow-hidden"
              >
                {/* Subtle background animation */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>

                {/* Image container with enhanced hover effects */}
                <div
                  className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center
                          shadow-sm group-hover:shadow-md transition-all duration-300 relative"
                >
                  {article.image ? (
                    <>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors duration-300">
                      <FileText size={20} />
                      <span className="text-xs mt-1">No Image</span>
                    </div>
                  )}
                </div>

                {/* Content section with enhanced typography */}
                <div className="px-5 flex-1 relative z-10">
                  <h2
                    className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 
                           transition-colors duration-300 line-clamp-2 mb-1"
                  >
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    {article.date}
                  </p>

                  {/* Read indicator */}
                  <div
                    className="flex items-center gap-1 text-xs text-blue-500 mt-2 opacity-0 group-hover:opacity-100 
                           transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  >
                    <span className="font-medium">Lihat artikel</span>
                    <svg
                      className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Action buttons with enhanced interactions */}
                <div className="flex space-x-2 relative z-10">
                  <button
                    className="group/btn p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                         rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         shadow-sm hover:shadow-md"
                    title="Edit artikel"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/forum/edit/${article.id}`);
                    }}
                  >
                    <Pencil
                      size={20}
                      className="transition-transform duration-200 group-hover/btn:rotate-12"
                    />
                  </button>

                  <button
                    className="group/btn p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 
                         rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         shadow-sm hover:shadow-md"
                    title="Hapus artikel"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(article);
                    }}
                  >
                    <Trash2
                      size={20}
                      className="transition-transform duration-200 group-hover/btn:rotate-12"
                    />
                  </button>
                </div>

                {/* Shine effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                ></div>
              </div>
            ))}
          </div>
        )}

        {/* ← TAMBAH: Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 transform transition-all">
              {/* Header dengan icon */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Hapus Artikel
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Apakah Anda yakin ingin menghapus artikel ini?
                </p>
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-400">
                  <p className="font-medium text-gray-900 text-sm">
                    "{articleToDelete?.title}"
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className="text-red-500 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-red-700">
                    Artikel akan dihapus secara permanen dan tidak dapat
                    dipulihkan
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="text-red-500 flex-shrink-0" size={16} />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>Hapus Artikel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ← TAMBAH: Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Berhasil!
                </h3>
                <p className="text-gray-600 mb-4">Artikel berhasil dihapus</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppsLayout>
  );
};

export default MyArticles;
