import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppsLayout from "../../../components/layout";
import { ArrowLeft, ThumbsUp, ThumbsDown, Calendar, User } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [likeStatus, setLikeStatus] = useState(null);
  const [likeCounts, setLikeCounts] = useState({ likes: 0, dislikes: 0 });
  const navigate = useNavigate();

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

    // Load reactions dari localStorage
    const loadReactionsFromStorage = () => {
      const reactions = JSON.parse(
        localStorage.getItem("article_reactions") || "{}"
      );
      const articleReactions = reactions[id] || { likes: [], dislikes: [] };

      // Set counts
      setLikeCounts({
        likes: articleReactions.likes.length,
        dislikes: articleReactions.dislikes.length,
      });

      // Set user reaction
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

  // Save reactions ke localStorage
  const saveReactionToStorage = (reactionType) => {
    if (!userId) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    const reactions = JSON.parse(
      localStorage.getItem("article_reactions") || "{}"
    );
    const articleReactions = reactions[id] || { likes: [], dislikes: [] };

    // Remove user dari kedua array
    articleReactions.likes = articleReactions.likes.filter(
      (uid) => uid !== userId
    );
    articleReactions.dislikes = articleReactions.dislikes.filter(
      (uid) => uid !== userId
    );

    let newStatus = null;

    // Toggle logic
    if (likeStatus === reactionType) {
      // Same reaction = remove (sudah difilter di atas)
      newStatus = null;
    } else {
      // Add to new reaction
      if (reactionType === "like") {
        articleReactions.likes.push(userId);
        newStatus = "like";
      } else {
        articleReactions.dislikes.push(userId);
        newStatus = "dislike";
      }
    }

    // Save to localStorage
    reactions[id] = articleReactions;
    localStorage.setItem("article_reactions", JSON.stringify(reactions));

    // Update state
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
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/forum")}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>
        </div>

        {/* Article Header Image - hanya muncul jika ada gambar */}
        {article.image && article.image !== "null" && (
          <div className="w-full bg-gray-200 rounded-xl mb-8 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>By {article.username}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              style={{ lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Action Buttons dengan Counts */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                likeStatus === "like"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ThumbsUp
                size={18}
                className={likeStatus === "like" ? "fill-current" : ""}
              />
              <span>Suka</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {likeCounts.likes}
              </span>
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                likeStatus === "dislike"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ThumbsDown
                size={18}
                className={likeStatus === "dislike" ? "fill-current" : ""}
              />
              <span>Tidak Suka</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {likeCounts.dislikes}
              </span>
            </button>
          </div>

          {!userId && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 Login untuk memberikan like atau dislike pada artikel ini
              </p>
            </div>
          )}
        </div>
      </div>
    </AppsLayout>
  );
};

export default ArticleDetail;
