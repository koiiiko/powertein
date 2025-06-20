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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Updated function to get article interactions from backend data
  const getArticleInteractions = useCallback((article) => {
    // Use backend data (like_count and dislike_count) instead of localStorage
    const likes = article.like_count || 0;
    const dislikes = article.dislike_count || 0;
    return likes + dislikes;
  }, []);

  const sortArticles = useCallback(
    (articlesData, sortType) => {
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
        case "popular":
          return sortedArticles.sort((a, b) => {
            const interactionsA = getArticleInteractions(a);
            const interactionsB = getArticleInteractions(b);
            return interactionsB - interactionsA;
          });
        default:
          return sortedArticles;
      }
    },
    [getArticleInteractions]
  );

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setShowSortMenu(false);
  };

  // Updated function to get top interacted articles using backend data
  const getTopInteractedArticles = useCallback(() => {
    if (!fetchedArticles.length) return [];

    const articlesWithInteractions = fetchedArticles.map((article) => ({
      ...article,
      interactions: getArticleInteractions(article),
    }));

    return articlesWithInteractions
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 3);
  }, [fetchedArticles, getArticleInteractions]);

  const handlePrevSlide = () => {
    const topArticles = getTopInteractedArticles();
    setCurrentSlide((prev) => (prev === 0 ? topArticles.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    const topArticles = getTopInteractedArticles();
    setCurrentSlide((prev) => (prev + 1) % topArticles.length);
  };

  // Create placeholder articles for skeleton
  const createPlaceholderArticles = (count = 6) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `placeholder-${index}`,
      title: "",
      content: "",
      username: "",
      date: "",
      image: null,
      like_count: 0,
      dislike_count: 0,
      isPlaceholder: true,
    }));
  };

  // Initialize with placeholders immediately
  useEffect(() => {
    setArticles(createPlaceholderArticles());
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/forum/articles")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched articles:", data); // Debug log
        setFetchedArticles(data);
        setDataLoaded(true);
      })
      .catch((err) => {
        console.error("Gagal fetch artikel:", err);
        setFetchedArticles([]);
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      if (fetchedArticles.length === 0) {
        setArticles([]);
      } else {
        const sortedData = sortArticles(fetchedArticles, sortBy);
        setArticles(sortedData);
      }
    }
  }, [fetchedArticles, sortBy, dataLoaded, sortArticles]);

  // Auto slide carousel
  useEffect(() => {
    const topArticles = getTopInteractedArticles();
    if (topArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % topArticles.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [getTopInteractedArticles]);

  // Show empty state only if data is loaded and no articles
  if (dataLoaded && fetchedArticles.length === 0) {
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

      {/* Trending Carousel - Updated to use backend data */}
      {dataLoaded &&
        (() => {
          const topArticles = getTopInteractedArticles();
          if (topArticles.length === 0) return null;

          return (
            <div className="relative w-full bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl h-60 mb-8 shadow-lg hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 ease-out overflow-hidden group border border-primary-200/40">
              {topArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
                  style={{
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                  }}
                >
                  <Link
                    to={`/forum/${article.id}?from=forum`}
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
                            className="absolute inset-0 bg-gradient-to-r from-primary-950/60 via-primary-900/30 to-transparent 
                                  group-hover/card:from-primary-950/75 group-hover/card:via-primary-900/45 group-hover/card:to-primary-800/15 
                                  transition-all duration-300"
                          ></div>
                        </>
                      ) : (
                        <div
                          className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 
                                group-hover/card:from-primary-500 group-hover/card:via-primary-600 group-hover/card:to-primary-700 
                                transition-all duration-300"
                        ></div>
                      )}
                      <div className="absolute inset-0 bg-primary-950/0 group-hover/card:bg-primary-950/10 transition-all duration-300"></div>
                      <div className="absolute inset-0 flex items-end p-6 pointer-events-none">
                        <div className="text-white transform transition-all duration-300 group-hover/card:translate-y-[-4px]">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="bg-gradient-to-r from-[#ea5272] to-[#d63c61] text-white px-3 py-1.5 rounded-full text-xs font-semibold
                                     shadow-lg hover:shadow-xl hover:shadow-[#ea5272]/40 transform hover:scale-105 transition-all duration-200
                                     flex items-center gap-1 border border-[#ea5272]/30 backdrop-blur-sm"
                            >
                              <span className="animate-pulse">🔥</span>
                              Trending #{index + 1}
                            </span>
                            <span
                              className="text-xs opacity-80 bg-card/20 px-2 py-1 rounded-full backdrop-blur-md
                                     group-hover/card:opacity-90 transition-opacity duration-200 border border-primary-200/20
                                     flex items-center gap-1"
                            >
                              <span>👍 {article.like_count || 0}</span>
                              <span>👎 {article.dislike_count || 0}</span>
                            </span>
                          </div>
                          <p className="text-primary-100 text-sm mb-1 opacity-85 group-hover/card:opacity-95 transition-opacity duration-200">
                            {article.date}
                          </p>
                          <h3
                            className="text-2xl font-bold mb-1 text-white group-hover/card:text-[#ffd4de] transition-colors duration-300
                                 drop-shadow-lg"
                          >
                            {article.title}
                          </h3>
                          <p className="text-primary-200 text-sm opacity-85 group-hover/card:opacity-95 transition-opacity duration-200">
                            By {article.username}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ea5272]/10 to-transparent 
                              -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-out"
                      ></div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Navigation Arrows */}
              {topArticles.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/30 hover:bg-primary-600/90 text-white rounded-full 
                       flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md
                       hover:scale-110 hover:shadow-xl hover:shadow-primary-500/30 active:scale-95
                       opacity-0 group-hover:opacity-100 hover:opacity-100
                       focus:outline-none focus:ring-2 focus:ring-ring border border-primary-200/30"
                    aria-label="Previous article"
                  >
                    <ChevronLeft
                      size={24}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/30 hover:bg-primary-600/90 text-white rounded-full 
                       flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md
                       hover:scale-110 hover:shadow-xl hover:shadow-primary-500/30 active:scale-95
                       opacity-0 group-hover:opacity-100 hover:opacity-100
                       focus:outline-none focus:ring-2 focus:ring-ring border border-primary-200/30"
                    aria-label="Next article"
                  >
                    <ChevronRight
                      size={24}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
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

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-muted/40">
                <div
                  className="h-full bg-gradient-to-r from-[#ea5272] via-primary-500 to-[#ea5272] transition-all duration-700 ease-out shadow-sm"
                  style={{
                    width: `${
                      ((currentSlide + 1) / topArticles.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })()}

      {/* Header dan Tombol */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Daftar Artikel
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              disabled={!dataLoaded}
              className="flex items-center px-3 py-2 text-sm text-muted-foreground border border-border rounded-md 
                   hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 
                   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
                   active:scale-95 transition-all duration-150 ease-in-out
                   shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Sort options"
            >
              <ArrowUpDown
                size={16}
                className="mr-1.5 transition-transform duration-200 hover:rotate-180"
              />
              <span className="text-xs">Sort</span>
            </button>

            {showSortMenu && dataLoaded && (
              <div
                className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-10 min-w-[160px]
                        animate-in fade-in-0 zoom-in-95 duration-100 origin-top-left"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleSort("newest")}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 
                         hover:bg-primary-50 hover:pl-5 active:bg-primary-100 
                         ${
                           sortBy === "newest"
                             ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                             : "text-card-foreground hover:text-primary-700"
                         }`}
                  >
                    <span className="flex items-center">
                      <span>Terbaru</span>
                      {sortBy === "newest" && (
                        <span className="ml-auto text-primary-500">✓</span>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSort("oldest")}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 
                         hover:bg-primary-50 hover:pl-5 active:bg-primary-100 
                         ${
                           sortBy === "oldest"
                             ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                             : "text-card-foreground hover:text-primary-700"
                         }`}
                  >
                    <span className="flex items-center">
                      <span>Terlama</span>
                      {sortBy === "oldest" && (
                        <span className="ml-auto text-primary-500">✓</span>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSort("popular")}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 
                         hover:bg-primary-50 hover:pl-5 active:bg-primary-100 
                         ${
                           sortBy === "popular"
                             ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                             : "text-card-foreground hover:text-primary-700"
                         }`}
                  >
                    <span className="flex items-center">
                      <span>Terpopuler</span>
                      {sortBy === "popular" && (
                        <span className="ml-auto text-primary-500">✓</span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 border-t mx-4 border-border" />

        <div className="flex items-center gap-3">
          <Link to="/forum/my">
            <button
              className="group flex items-center px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg 
                       hover:bg-primary-100 hover:border-primary-300 hover:text-primary-800 hover:shadow-md
                       active:bg-primary-200 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
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
              className="group flex items-center px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg 
                       hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30
                       active:bg-primary-800 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       transition-all duration-200 ease-out"
            >
              <FilePenLine
                size={16}
                className="mr-2 transition-transform duration-200 group-hover:scale-110"
              />
              <span>Buat Artikel</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Grid Artikel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {articles.map((article) => (
          <div key={article.id}>
            {article.isPlaceholder ? (
              // Skeleton Card
              <div className="bg-white rounded-xl shadow-md p-4 h-[420px] border border-gray-100">
                <div className="animate-pulse">
                  <div className="w-full h-28 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-3">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ) : (
              // Real Article Card with interaction count
              <Link to={`/forum/${article.id}?from=forum`}>
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-[420px] group hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 ease-out transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 cursor-pointer relative overflow-hidden">
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

                  <div className="flex flex-col h-full min-h-0">
                    {/* Header Section - Fixed */}
                    <div className="flex-shrink-0">
                      <h4 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                        {article.title}
                      </h4>

                      <div className="flex items-center gap-2 mb-3 min-w-0">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200 flex-shrink-0">
                          <span className="text-xs text-gray-600 group-hover:text-blue-600 font-medium">
                            {article.username?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">
                          By {article.username}
                        </p>
                      </div>
                    </div>

                    {/* Content Section - Flexible */}
                    <div className="flex-grow overflow-hidden mb-3 relative">
                      <div
                        className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200 leading-relaxed h-full overflow-hidden"
                        style={{
                          wordBreak: "break-word",
                          lineHeight: "1.4",
                        }}
                      >
                        {/* Strip HTML tags and show plain text */}
                        {article.content
                          ? article.content.replace(/<[^>]*>/g, "").trim()
                          : ""}
                      </div>
                      {/* Gradient fade-out effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Footer Section - Fixed at Bottom */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-blue-100 transition-colors duration-200 flex-shrink-0 min-w-0 mt-auto">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200 truncate flex-shrink-0">
                          {article.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0">
                        <span className="font-medium whitespace-nowrap">
                          Baca selengkapnya
                        </span>
                        <svg
                          className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0"
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
            )}
          </div>
        ))}
      </div>
    </AppsLayout>
  );
};

export default Forum;
