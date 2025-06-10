import AppsLayout from "../../../components/layout";
import { useEffect, useState } from "react";
import { FilePenLine, ArrowUpDown, User2 } from "lucide-react";
import { Link } from "react-router-dom";

const Forum = () => {
  const [fetchedArticles, setFetchedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest

  // Fungsi untuk mendapatkan total interaksi dari localStorage
  const getArticleInteractions = (articleId) => {
    const reactions = JSON.parse(
      localStorage.getItem("article_reactions") || "{}"
    );
    const articleReactions = reactions[articleId] || {
      likes: [],
      dislikes: [],
    };
    return articleReactions.likes.length + articleReactions.dislikes.length;
  };

  // Fungsi untuk sort artikel
  // Contoh di sortArticles:
  const sortArticles = (articlesData, sortType) => {
    const sortedArticles = [...articlesData];
    switch (sortType) {
      case "newest":
        return sortedArticles.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
      case "oldest":
        return sortedArticles.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateA - dateB;
        });
      default:
        return sortedArticles;
    }
  };

  // Fungsi untuk handle sort selection
  const handleSort = (sortType) => {
    setSortBy(sortType);
    setShowSortMenu(false);
  };

  const getMostInteractedArticle = () => {
    if (!fetchedArticles.length) return null;

    let mostInteracted = fetchedArticles[0];
    let maxInteractions = getArticleInteractions(fetchedArticles[0].id);

    fetchedArticles.forEach((article) => {
      const interactions = getArticleInteractions(article.id);
      if (interactions > maxInteractions) {
        maxInteractions = interactions;
        mostInteracted = article;
      }
    });

    return mostInteracted;
  };

  useEffect(() => {
    fetch("http://localhost:5000/forum/articles")
      .then((res) => res.json())
      .then((data) => setFetchedArticles(data))
      .catch((err) => console.error("Gagal fetch artikel:", err));
  }, []);

  useEffect(() => {
    const sortedData = sortArticles(fetchedArticles, sortBy);
    setArticles(sortedData);
  }, [fetchedArticles, sortBy]);

  if (!articles.length) {
    return (
      <AppsLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800 mb-4" />
          <p className="text-lg font-medium">Memuat artikel...</p>
          <p className="text-sm text-gray-400 mt-1">Silakan tunggu sebentar</p>
        </div>
      </AppsLayout>
    );
  }

  return (
    <AppsLayout>
      {showSortMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSortMenu(false)}
        />
      )}

      {/* Cover Artikel */}
      {articles[0] && (
        <Link to={`/forum/${getMostInteractedArticle().id}`}>
          <div className="w-full bg-gray-200 rounded-xl h-52 p-6 mb-8 shadow-md relative overflow-hidden">
            {/* Background image jika ada */}
            {getMostInteractedArticle()?.image && (
              <>
                <img
                  src={getMostInteractedArticle().image}
                  alt={getMostInteractedArticle().title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                {/* Gradient overlay dari kiri (transparent) ke kanan (semi-transparent) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/50 to-black/10"></div>
              </>
            )}
            {/* Content overlay */}
            <div className="relative z-10">
              <p className="text-sm text-white mb-1">
                {getMostInteractedArticle().date}
              </p>
              <h3 className="text-2xl font-bold text-white">
                {getMostInteractedArticle().title}
              </h3>
              <p className="text-sm text-white/90">
                By {getMostInteractedArticle().username}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Header dan Tombol */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700">
            Daftar Artikel
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <ArrowUpDown size={16} className="mr-1" />
            </button>

            {/* Sort Menu Dropdown */}
            {showSortMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={() => handleSort("newest")}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === "newest"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => handleSort("oldest")}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === "oldest"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  Terlama
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 border-t mx-4 border-gray-300" />
        <div className="flex items-center gap-2">
          <Link to="/forum/my">
            <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700">
              <User2 size={16} className="mr-1" />
              Artikel Saya
            </button>
          </Link>
          <Link to="/forum/new">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700">
              <FilePenLine size={16} className="mr-2" />
              Buat Artikel
            </button>
          </Link>
        </div>
      </div>

      {/* Grid Artikel */}
      <div className="grid md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link to={`/forum/${article.id}`} key={article.id}>
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-96">
              {/* Image container dengan tinggi tetap - hanya muncul jika ada gambar */}
              {article.image && (
                <div className="w-full h-28 mb-3 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={article.image}
                    alt={`Gambar untuk ${article.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x120?text=Gambar+Tidak+Tersedia";
                    }}
                  />
                </div>
              )}

              {/* Content area dengan flex-grow */}
              <div className="flex-grow flex flex-col">
                <h4 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  By {article.username}
                </p>
                <div
                  className="text-sm text-gray-500 line-clamp-5 flex-grow overflow-hidden"
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    maxHeight: "7.5rem", // sekitar 5 baris
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                <p className="text-xs text-right text-gray-400 mt-3 pt-2 border-t border-gray-100">
                  {article.date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppsLayout>
  );
};

export default Forum;
