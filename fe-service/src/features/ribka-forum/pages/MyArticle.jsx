import { useEffect, useState } from "react";
import axios from "axios";
import AppsLayout from "../../../components/layout";
import BackButton from "../components/HandleBack";
import { Pencil, Trash2, AlertTriangle, CheckCircle, X, FileText } from "lucide-react";
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
            <FileText className="h-20 w-20 text-gray-400" />

            <h2 className="text-2xl font-semibold text-gray-900">
              Belum ada artikel yang Anda buat
            </h2>

            <p className="text-gray-600">
              Mulai buat artikel pertama Anda sekarang untuk berbagi informasi
              menarik dengan komunitas.
            </p>

            <button
              onClick={() => navigate("/forum/new")}
              className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-md"
            >
              Buat Artikel Baru
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/forum/${article.id}`)}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center px-1">
                      No Image
                    </span>
                  )}
                </div>

                <div className="px-4 flex-1">
                  <h2 className="text-base font-semibold text-gray-800">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{article.date}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    className="p-2 text-gray-800 hover:text-gray-700 transition"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/forum/edit/${article.id}`);
                    }}
                  >
                    <Pencil size={24} />
                  </button>

                  <button
                    className="p-2 text-gray-800 hover:text-gray-700 transition"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(article);
                    }}
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ← TAMBAH: Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-300" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Hapus Artikel
                  </h3>
                  <p className="text-sm text-gray-400">
                    Konfirmasi penghapusan
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-2">
                Apakah Anda yakin ingin menghapus artikel:
              </p>
              <p className="font-medium text-white mb-4">
                "{articleToDelete?.title}"
              </p>
              <p className="text-sm text-red-400 mb-6">
                ⚠️ Tindakan ini tidak dapat dibatalkan
              </p>

              {errorMessage && (
                <div className="bg-red-900 border border-red-600 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-300">{errorMessage}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Hapus
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
