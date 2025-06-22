import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppsLayout from "../../../components/layout";
import {
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import BackButton from "../components/HandleBack";

const ArticleDetail = () => {
  const { id } = useParams();

  // Initialize dengan data kosong, bukan null
  const [article, setArticle] = useState({
    title: "",
    content: "",
    date: "",
    username: "",
    image: null,
    id: null,
    like_count: 0,
    dislike_count: 0,
    userReaction: null,
  });

  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");

  const [dataLoaded, setDataLoaded] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/forum/articles/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setArticleNotFound(true);
          } else {
            setLoadingError(true);
          }
          setDataLoaded(true);
          return;
        }

        const data = await response.json();
        console.log("Data from backend:", data); // Debug log

        // Jika data kosong atau null, anggap artikel tidak ditemukan
        if (!data || !data.id) {
          setArticleNotFound(true);
        } else {
          setArticle({
            ...data,
            like_count: data.like_count || 0,
            dislike_count: data.dislike_count || 0,
            userReaction: null, // Will be set by loadReactionsFromStorage
          });
        }

        setDataLoaded(true);
      } catch (err) {
        console.error("Gagal ambil detail artikel:", err);
        setLoadingError(true);
        setDataLoaded(true);
      }
    };

    const loadReactionsFromStorage = () => {
      if (!userId) return;

      const reactions = JSON.parse(
        localStorage.getItem("article_reactions") || "{}"
      );
      const articleReactions = reactions[id];

      if (articleReactions) {
        if (articleReactions.likes && articleReactions.likes.includes(userId)) {
          setArticle((prev) => ({ ...prev, userReaction: "like" }));
        } else if (
          articleReactions.dislikes &&
          articleReactions.dislikes.includes(userId)
        ) {
          setArticle((prev) => ({ ...prev, userReaction: "dislike" }));
        }
      }
    };

    // Load article first, then load reactions
    loadArticle().then(() => {
      // Only load reactions after article is loaded
      setTimeout(() => {
        loadReactionsFromStorage();
      }, 100);
    });
  }, [id, userId]); // Remove dataLoaded dependency

  const [errorMessage, setErrorMessage] = useState("");
  const handleReaction = async (reactionType) => {
    if (!userId) {
      setErrorMessage("Anda harus login terlebih dahulu");
      return;
    }

    if (reactionLoading) return; // Prevent multiple clicks

    setReactionLoading(true);

    try {
      // Cek reaksi user saat ini dari localStorage
      const reactions = JSON.parse(
        localStorage.getItem("article_reactions") || "{}"
      );
      const articleReactions = reactions[id] || { likes: [], dislikes: [] };

      const hasLiked = articleReactions.likes.includes(userId);
      const hasDisliked = articleReactions.dislikes.includes(userId);
      const currentReaction = hasLiked
        ? "like"
        : hasDisliked
        ? "dislike"
        : null;

      console.log("Current reaction:", currentReaction);
      console.log("New reaction:", reactionType);

      // Tentukan action berdasarkan state saat ini
      let action = "add";
      let newUserReaction = reactionType;

      if (currentReaction === reactionType) {
        // User menekan tombol yang sama, hapus reaksi
        action = "remove";
        newUserReaction = null;
      } else if (currentReaction && currentReaction !== reactionType) {
        // User ganti reaksi - backend akan handle remove old + add new
        // Di frontend tetap action = "add", tapi update localStorage untuk remove old reaction
        action = "add";
        newUserReaction = reactionType;
      }

      console.log("Final action:", action);

      // Kirim request ke backend
      const response = await fetch(
        `http://localhost:5000/forum/articles/${id}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            reactionType: reactionType,
            action: action,
            currentReaction: currentReaction, // Kirim info reaksi saat ini ke backend
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memproses reaksi");
      }

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.success) {
        // Update localStorage
        articleReactions.likes = articleReactions.likes.filter(
          (uid) => uid !== userId
        );
        articleReactions.dislikes = articleReactions.dislikes.filter(
          (uid) => uid !== userId
        );

        if (newUserReaction === "like") {
          articleReactions.likes.push(userId);
        } else if (newUserReaction === "dislike") {
          articleReactions.dislikes.push(userId);
        }

        reactions[id] = articleReactions;
        localStorage.setItem("article_reactions", JSON.stringify(reactions));

        // Update state
        setArticle((prevArticle) => ({
          ...prevArticle,
          like_count: result.data.likes,
          dislike_count: result.data.dislikes,
          userReaction: newUserReaction,
        }));

        console.log("Final state update:", {
          likes: result.data.likes,
          dislikes: result.data.dislikes,
          userReaction: newUserReaction,
        });
      } else {
        setErrorMessage(result.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      setErrorMessage("Terjadi kesalahan saat memproses reaksi");
    } finally {
      setReactionLoading(false);
    }
  };

  const handleLike = () => handleReaction("like");
  const handleDislike = () => handleReaction("dislike");

  // Tampilan ketika artikel tidak ditemukan
  if (dataLoaded && articleNotFound) {
    return (
      <AppsLayout>
        <div className="w-full px-2 md:px-4">
          <div className="mb-6">
            <BackButton
              to={fromPage === "my-articles" ? "/forum/my" : "/forum"}
              label={
                fromPage === "my-articles"
                  ? "Kembali ke Artikel Saya"
                  : "Kembali ke Forum"
              }
            />
          </div>

          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 max-w-md w-full
                            transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6
                              animate-pulse"
              >
                <AlertCircle size={40} className="text-red-500" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Artikel Tidak Ditemukan
              </h1>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Maaf, artikel yang Anda cari tidak dapat ditemukan. Artikel
                mungkin telah dihapus atau URL yang Anda akses tidak valid.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => (window.location.href = "/forum")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                           transition-colors duration-200 font-medium shadow-md hover:shadow-lg
                           transform hover:scale-105 active:scale-95"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppsLayout>
    );
  }

  // Tampilan ketika terjadi error loading
  if (dataLoaded && loadingError) {
    return (
      <AppsLayout>
        <div className="w-full px-2 md:px-4">
          <div className="mb-6">
            <BackButton
              to={fromPage === "my-articles" ? "/forum/my" : "/forum"}
              label={
                fromPage === "my-articles"
                  ? "Kembali ke Artikel Saya"
                  : "Kembali ke Forum"
              }
            />
          </div>

          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 max-w-md w-full
                            transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6
                              animate-pulse"
              >
                <AlertCircle size={40} className="text-orange-500" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Terjadi Kesalahan
              </h1>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Maaf, terjadi kesalahan saat memuat artikel. Silakan coba lagi
                dalam beberapa saat.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                           transition-colors duration-200 font-medium shadow-md hover:shadow-lg
                           transform hover:scale-105 active:scale-95"
                >
                  Coba Lagi
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                           transition-colors duration-200 font-medium
                           transform hover:scale-105 active:scale-95"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppsLayout>
    );
  }

  // Tampilan normal artikel
  return (
    <AppsLayout>
      {errorMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50">
          {errorMessage}
          <button
            onClick={() => setErrorMessage("")}
            className="ml-3 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="w-full px-2 md:px-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton
            to={fromPage === "my-articles" ? "/forum/my" : "/forum"}
            label={
              fromPage === "my-articles"
                ? "Kembali ke Artikel Saya"
                : "Kembali ke Forum"
            }
          />
        </div>

        {/* Article Header Image */}
        {dataLoaded && article.image && article.image !== "null" && (
          <div
            className="w-full bg-gray-200 rounded-xl mb-8 overflow-hidden shadow-lg hover:shadow-2xl 
                          transition-all duration-500 ease-out group relative"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover transition-transform duration-700 ease-out 
                         group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4"
            >
              <p className="text-white text-sm font-medium">{article.title}</p>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div
          className="bg-white rounded-xl p-4 md:p-8 shadow-lg hover:shadow-xl 
                        transition-all duration-500 ease-out border border-gray-100 hover:border-gray-200
                        relative overflow-hidden group"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/30 to-purple-50/0 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>

          <div className="relative z-10">
            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight 
                           group-hover:text-gray-800 transition-colors duration-300 min-h-[3rem]"
            >
              {article.title || (
                <div className="animate-pulse bg-gray-200 h-10 rounded w-3/4"></div>
              )}
            </h1>

            {/* Metadata */}
            <div
              className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600 border-b border-gray-200 pb-6
                            group-hover:border-gray-300 transition-colors duration-300 min-h-[2rem]"
            >
              {dataLoaded ? (
                <>
                  <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 cursor-default">
                    <div className="p-1 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                      <Calendar size={16} />
                    </div>
                    <span className="font-medium">{article.date}</span>
                  </div>
                  <div className="text-gray-300 group-hover:text-gray-400 transition-colors duration-200">
                    |
                  </div>
                  <div className="flex items-center gap-2 hover:text-purple-600 transition-colors duration-200 cursor-default">
                    <div className="p-1 rounded-full bg-gray-100 group-hover:bg-purple-100 transition-colors duration-200">
                      <User size={16} />
                    </div>
                    <span className="font-medium">By {article.username}</span>
                  </div>
                </>
              ) : (
                <div className="animate-pulse flex gap-4">
                  <div className="bg-gray-200 h-4 rounded w-24"></div>
                  <div className="bg-gray-200 h-4 rounded w-32"></div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8 min-h-[200px]">
              {dataLoaded && article.content ? (
                <div
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap group-hover:text-gray-600 
                             transition-colors duration-300"
                  style={{ lineHeight: "1.8" }}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="animate-pulse space-y-3">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-5/6"></div>
                  <div className="bg-gray-200 h-4 rounded w-4/6"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-5/6"></div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className="flex items-center gap-4 pt-6 border-t border-gray-200 group-hover:border-gray-300 
                            transition-colors duration-300"
            >
              <button
                onClick={handleLike}
                disabled={!dataLoaded || reactionLoading}
                className={`group/like flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 
                           transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                           shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                             article.userReaction === "like"
                               ? "bg-green-50 border-green-200 text-green-700 focus:ring-green-500 shadow-green-100"
                               : "bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-600 focus:ring-green-500"
                           }`}
              >
                <ThumbsUp
                  size={20}
                  className={`transition-all duration-200 group-hover/like:scale-110 ${
                    article.userReaction === "like" ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">Suka</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    article.userReaction === "like"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 group-hover/like:bg-green-100 group-hover/like:text-green-600"
                  }`}
                >
                  {article.like_count}
                </span>
              </button>

              <button
                onClick={handleDislike}
                disabled={!dataLoaded || reactionLoading}
                className={`group/dislike flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 
                           transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                           shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                             article.userReaction === "dislike"
                               ? "bg-red-50 border-red-200 text-red-700 focus:ring-red-500 shadow-red-100"
                               : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 focus:ring-red-500"
                           }`}
              >
                <ThumbsDown
                  size={20}
                  className={`transition-all duration-200 group-hover/dislike:scale-110 ${
                    article.userReaction === "dislike" ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">Tidak Suka</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    article.userReaction === "dislike"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600 group-hover/dislike:bg-red-100 group-hover/dislike:text-red-600"
                  }`}
                >
                  {article.dislike_count}
                </span>
              </button>

              {/* Loading indicator */}
              {reactionLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span>Memproses...</span>
                </div>
              )}
            </div>

            {/* Login Notice */}
            {!userId && (
              <div
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 
                              rounded-xl shadow-sm hover:shadow-md transition-all duration-300
                              transform hover:scale-[1.02] relative overflow-hidden group/notice"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 
                                -translate-x-full group-hover/notice:translate-x-full transition-transform duration-1000"
                ></div>

                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center
                                  group-hover/notice:bg-blue-200 transition-colors duration-200"
                  >
                    <span className="text-blue-600 text-lg">💡</span>
                  </div>
                  <p
                    className="text-sm text-blue-700 font-medium group-hover/notice:text-blue-800 
                                transition-colors duration-200"
                  >
                    Login untuk memberikan like atau dislike pada artikel ini
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Shine effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                          pointer-events-none"
          ></div>
        </div>
      </div>
    </AppsLayout>
  );
};

export default ArticleDetail;
