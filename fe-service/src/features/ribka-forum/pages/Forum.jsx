import AppsLayout from "../../../components/layout";
import { useEffect, useState, useCallback } from "react";
import {
  FilePenLine,
  ArrowUpDown,
  User2,
  ChevronLeft,
  ChevronRight,
  PenTool,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const Forum = () => {
  const [fetchedArticles, setFetchedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setShowSortMenu(false);
  };

  const getTopInteractedArticles = useCallback(() => {
    if (!fetchedArticles.length) return [];

    const articlesWithInteractions = fetchedArticles.map((article) => ({
      ...article,
      interactions: getArticleInteractions(article.id),
    }));

    return articlesWithInteractions
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 3);
  }, [fetchedArticles]);

  const handlePrevSlide = () => {
    const topArticles = getTopInteractedArticles();
    setCurrentSlide((prev) => (prev === 0 ? topArticles.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    const topArticles = getTopInteractedArticles();
    setCurrentSlide((prev) => (prev + 1) % topArticles.length);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/forum/articles")
      .then((res) => res.json())
      .then((data) => {
        setFetchedArticles(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch artikel:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const sortedData = sortArticles(fetchedArticles, sortBy);
    setArticles(sortedData);
  }, [fetchedArticles, sortBy]);

  // Auto slide carousel
  useEffect(() => {
    const topArticles = getTopInteractedArticles();
    if (topArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % topArticles.length);
      }, 5000); // Ganti slide setiap 5 detik

      return () => clearInterval(interval);
    }
  }, [getTopInteractedArticles]);

  if (isLoading) {
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

  //kalo belum ada artikelnya
  if (fetchedArticles.length === 0) {
    return (
      <AppsLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-600 px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <FileText size={32} className="text-blue-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Belum Ada Artikel
          </h3>

          <p className="text-gray-500 text-center mb-8 max-w-lg leading-relaxed">
            Mulai berbagi pengetahuan dan pengalaman Anda dengan membuat artikel
            pertama!
          </p>

          <Link to="/forum/new">
            <button className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              <PenTool
                size={20}
                className="mr-3 group-hover:rotate-12 transition-transform duration-200"
              />
              Buat Artikel Pertama
            </button>
          </Link>
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

      {/* artikel trending */}
      {(() => {
        const topArticles = getTopInteractedArticles();
        if (topArticles.length === 0) return null;

        return (
          <div className="relative w-full bg-gray-200 rounded-xl h-52 mb-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden group">
            {topArticles.map((article, index) => (
              <div
                key={article.id}
                className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                }}
              >
                <Link
                  to={`/forum/${article.id}`}
                  className="absolute inset-0 group/card"
                >
                  <div className="w-full h-full relative overflow-hidden">
                    {article.image ? (
                      <>
                        <img
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10 
                                  group-hover/card:from-black/90 group-hover/card:via-black/50 group-hover/card:to-black/20 
                                  transition-all duration-300"
                        ></div>
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 
                                group-hover/card:from-gray-500 group-hover/card:to-gray-700 transition-all duration-300"
                      ></div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-all duration-300"></div>

                    <div className="absolute inset-0 flex items-end p-6 pointer-events-none">
                      <div className="text-white transform transition-all duration-300 group-hover/card:translate-y-[-4px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold
                                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                                     flex items-center gap-1"
                          >
                            <span className="animate-pulse">🔥</span>
                            Trending #{index + 1}
                          </span>
                          <span
                            className="text-xs opacity-75 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm
                                     group-hover/card:opacity-90 transition-opacity duration-200"
                          >
                            {article.interactions} interaksi
                          </span>
                        </div>
                        <p className="text-sm mb-1 opacity-80 group-hover/card:opacity-90 transition-opacity duration-200">
                          {article.date}
                        </p>
                        <h3
                          className="text-2xl font-bold mb-1 group-hover/card:text-yellow-200 transition-colors duration-300
                                 drop-shadow-lg"
                        >
                          {article.title}
                        </h3>
                        <p className="text-sm opacity-80 group-hover/card:opacity-90 transition-opacity duration-200">
                          By {article.username}
                        </p>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                              -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-out"
                    ></div>
                  </div>
                </Link>
              </div>
            ))}

            {topArticles.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/60 text-white rounded-full 
                       flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md
                       hover:scale-110 hover:shadow-xl active:scale-95
                       opacity-0 group-hover:opacity-100 hover:opacity-100
                       focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Previous article"
                >
                  <ChevronLeft
                    size={24}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/60 text-white rounded-full 
                       flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md
                       hover:scale-110 hover:shadow-xl active:scale-95
                       opacity-0 group-hover:opacity-100 hover:opacity-100
                       focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Next article"
                >
                  <ChevronRight
                    size={24}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </button>
              </>
            )}

            {topArticles.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {topArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20
                         ${
                           index === currentSlide
                             ? "w-8 h-3 bg-white shadow-lg"
                             : "w-3 h-3 bg-white/50 hover:bg-white/80 hover:scale-125 active:scale-110"
                         }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-blue-500 transition-all duration-700 ease-out"
                style={{
                  width: `${((currentSlide + 1) / topArticles.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        );
      })()}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700">
            Daftar Artikel
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md 
                   hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                   active:scale-95 transition-all duration-150 ease-in-out
                   shadow-sm hover:shadow-md"
              aria-label="Sort options"
            >
              <ArrowUpDown
                size={16}
                className="mr-1.5 transition-transform duration-200 hover:rotate-180"
              />
              <span className="text-xs">Sort</span>
            </button>

            {showSortMenu && (
              <div
                className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[160px]
                        animate-in fade-in-0 zoom-in-95 duration-100 origin-top-left"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleSort("newest")}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 
                         hover:bg-gray-50 hover:pl-5 active:bg-gray-100 
                         ${
                           sortBy === "newest"
                             ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                             : "text-gray-700 hover:text-gray-900"
                         }`}
                  >
                    <span className="flex items-center">
                      <span>Terbaru</span>
                      {sortBy === "newest" && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSort("oldest")}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 
                         hover:bg-gray-50 hover:pl-5 active:bg-gray-100 
                         ${
                           sortBy === "oldest"
                             ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                             : "text-gray-700 hover:text-gray-900"
                         }`}
                  >
                    <span className="flex items-center">
                      <span>Terlama</span>
                      {sortBy === "oldest" && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 border-t mx-4 border-gray-300" />

        <div className="flex items-center gap-3">
          <Link to="/forum/my">
            <button
              className="group flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg 
                         hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 
                         active:translate-y-0 active:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                         transition-all duration-200 ease-out"
            >
              <User2
                size={16}
                className="mr-2 transition-transform duration-200 group-hover:scale-110"
              />
              <span>Artikel Saya</span>
            </button>
          </Link>

          <Link to="/forum/new">
            <button
              className="group flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg 
                         hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:-translate-y-0.5 
                         active:translate-y-0 active:shadow-lg active:from-gray-900 active:to-gray-800
                         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                         transition-all duration-200 ease-out relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
              ></div>
              <FilePenLine
                size={16}
                className="mr-2 transition-transform duration-200 group-hover:scale-110"
              />
              <span className="relative z-10">Buat Artikel</span>
            </button>
          </Link>
        </div>
      </div>

      {/* daftar artikel*/}
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link to={`/forum/${article.id}`} key={article.id}>
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-[420px] group hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 ease-out transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 cursor-pointer">
              {article.image && (
                <div className="w-full h-28 mb-3 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img
                    src={article.image}
                    alt={`Gambar untuk ${article.title}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x120?text=Gambar+Tidak+Tersedia";
                    }}
                  />
                </div>
              )}

              <div className="flex-grow flex flex-col">
                <h4 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {article.title}
                </h4>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                    <span className="text-xs text-gray-600 group-hover:text-blue-600 font-medium">
                      {article.username?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                    By {article.username}
                  </p>
                </div>

                <div
                  className="text-sm text-gray-500 line-clamp-6 flex-grow overflow-hidden group-hover:text-gray-600 transition-colors duration-200"
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    maxHeight: "7.5rem",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 group-hover:border-blue-100 transition-colors duration-200">
                  <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200">
                    {article.date}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    <span className="font-medium">Baca selengkapnya</span>
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
              </div>

              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </Link>
        ))}
      </div>
    </AppsLayout>
  );
};

export default Forum;
