import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppsLayout from "../../../components/layout";
import { ArrowLeft, ThumbsUp, ThumbsDown, Calendar, User } from "lucide-react";
import BackButton from "../components/HandleBack";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [likeStatus, setLikeStatus] = useState(null);
  const [likeCounts, setLikeCounts] = useState({ likes: 0, dislikes: 0 });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/forum/articles/${id}`
        );
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error("Gagal ambil detail artikel:", err);
      }
    };

    const loadReactionsFromStorage = () => {
      const reactions = JSON.parse(
        localStorage.getItem("article_reactions") || "{}"
      );
      const articleReactions = reactions[id] || { likes: [], dislikes: [] };

      setLikeCounts({
        likes: articleReactions.likes.length,
        dislikes: articleReactions.dislikes.length,
      });

      if (userId) {
        if (articleReactions.likes.includes(userId)) {
          setLikeStatus("like");
        } else if (articleReactions.dislikes.includes(userId)) {
          setLikeStatus("dislike");
        }
      }
    };

    loadArticle();
    loadReactionsFromStorage();
  }, [id, userId]);

  const saveReactionToStorage = (reactionType) => {
    if (!userId) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    const reactions = JSON.parse(
      localStorage.getItem("article_reactions") || "{}"
    );
    const articleReactions = reactions[id] || { likes: [], dislikes: [] };

    articleReactions.likes = articleReactions.likes.filter(
      (uid) => uid !== userId
    );
    articleReactions.dislikes = articleReactions.dislikes.filter(
      (uid) => uid !== userId
    );

    let newStatus = null;

    if (likeStatus === reactionType) {
      newStatus = null;
    } else {
      if (reactionType === "like") {
        articleReactions.likes.push(userId);
        newStatus = "like";
      } else {
        articleReactions.dislikes.push(userId);
        newStatus = "dislike";
      }
    }

    reactions[id] = articleReactions;
    localStorage.setItem("article_reactions", JSON.stringify(reactions));

    setLikeStatus(newStatus);
    setLikeCounts({
      likes: articleReactions.likes.length,
      dislikes: articleReactions.dislikes.length,
    });
  };

  const handleLike = () => saveReactionToStorage("like");
  const handleDislike = () => saveReactionToStorage("dislike");

  if (!article) return <p>Memuat artikel...</p>;

  return (
    <AppsLayout>
      <div className="w-full px-2 md:px-4">
        <div className="mb-6">
          <BackButton />
        </div>

        {article.image && article.image !== "null" && (
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

        <div
          className="bg-white rounded-xl p-4 md:p-8 
                  transition-all duration-500 ease-out hover:border-gray-200
                  relative overflow-hidden group"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/30 to-purple-50/0 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>

          <div className="relative z-10">
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight 
                     group-hover:text-gray-800 transition-colors duration-300"
            >
              {article.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600 border-b border-gray-200 pb-6
                      group-hover:border-gray-300 transition-colors duration-300"
            >
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
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap group-hover:text-gray-600 
                     transition-colors duration-300"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            <div
              className="flex items-center gap-4 pt-6 border-t border-gray-200 group-hover:border-gray-300 
                      transition-colors duration-300"
            >
              <button
                onClick={handleLike}
                className={`group/like flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 
                     transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                     shadow-sm hover:shadow-lg ${
                       likeStatus === "like"
                         ? "bg-green-50 border-green-200 text-green-700 focus:ring-green-500 shadow-green-100"
                         : "bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-600 focus:ring-green-500"
                     }`}
              >
                <ThumbsUp
                  size={20}
                  className={`transition-all duration-200 group-hover/like:scale-110 ${
                    likeStatus === "like" ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">Suka</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    likeStatus === "like"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 group-hover/like:bg-green-100 group-hover/like:text-green-600"
                  }`}
                >
                  {likeCounts.likes}
                </span>
              </button>

              <button
                onClick={handleDislike}
                className={`group/dislike flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 
                     transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                     shadow-sm hover:shadow-lg ${
                       likeStatus === "dislike"
                         ? "bg-red-50 border-red-200 text-red-700 focus:ring-red-500 shadow-red-100"
                         : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 focus:ring-red-500"
                     }`}
              >
                <ThumbsDown
                  size={20}
                  className={`transition-all duration-200 group-hover/dislike:scale-110 ${
                    likeStatus === "dislike" ? "fill-current" : ""
                  }`}
                />
                <span className="font-medium">Tidak Suka</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    likeStatus === "dislike"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600 group-hover/dislike:bg-red-100 group-hover/dislike:text-red-600"
                  }`}
                >
                  {likeCounts.dislikes}
                </span>
              </button>
            </div>

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
