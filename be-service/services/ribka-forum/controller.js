const {
  getAllArticles,
  getArticleById,
  addArticleToDB,
  updateArticleInDB,
  deleteArticleFromDB,
  updateLikeCount,
  updateDislikeCount,
} = require("./model");

const fetchArticles = async (req, res) => {
  try {
    const articles = await getAllArticles();
    const articlesWithImages = articles.map((article) => ({
      ...article,
      image: article.image
        ? `data:image/jpeg;base64,${article.image.toString("base64")}`
        : null,
      date: new Date(article.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
    res.json(articlesWithImages);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil artikel", error });
  }
};

const fetchArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    const result = {
      ...article,
      image: article.image
        ? `data:image/jpeg;base64,${article.image.toString("base64")}`
        : null,
      date: new Date(article.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    res.json(result);
  } catch (error) {
    console.error("Error ambil artikel by ID:", error);
    res.status(500).json({ message: "Gagal mengambil detail artikel", error });
  }
};

function validateArticleInput({ title, content }) {
  if (!title || !content) {
    return "Judul dan isi artikel tidak boleh kosong.";
  }

  if (title.length < 10 || title.length > 50) {
    return "Judul harus antara 10–50 karakter.";
  }

  const plainText = content.replace(/<[^>]*>/g, "").trim();
  const wordCount = plainText.split(/\s+/).length;

  if (wordCount < 300 || wordCount > 5000) {
    return "Isi artikel harus antara 300–5000 kata.";
  }

  return null;
}

const createArticle = async (req, res) => {
  const { title, content, username, user_id, image } = req.body;

  const validationError = validateArticleInput({ title, content });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    await addArticleToDB({ title, content, username, user_id, image });
    res.status(201).json({ message: "Artikel berhasil dibuat." });
  } catch (error) {
    console.error("Gagal membuat artikel:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat membuat artikel." });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;

  const validationError = validateArticleInput({ title, content });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return res.status(404).json({ message: "Artikel tidak ditemukan." });
    }

    const imageToUpdate =
      typeof image === "string" && image.trim() !== "" ? image : undefined;

    await updateArticleInDB({ id, title, content, image: imageToUpdate });
    res.status(200).json({ message: "Artikel berhasil diperbarui." });
  } catch (error) {
    console.error("Gagal mengupdate artikel:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengupdate artikel." });
  }
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan.",
      });
    }

    const result = await deleteArticleFromDB(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan atau sudah dihapus.",
      });
    }

    console.log(`Article ${id} deleted successfully`);
    res.status(200).json({
      success: true,
      message: "Artikel berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus artikel.",
      error: error.message,
    });
  }
};

const handleReaction = async (req, res) => {
  const { id } = req.params; // article id
  const { userId, reactionType, action, currentReaction } = req.body;

  console.log("Received reaction request:", {
    id,
    userId,
    reactionType,
    action,
    currentReaction,
  });

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID diperlukan",
    });
  }

  if (!["like", "dislike"].includes(reactionType)) {
    return res.status(400).json({
      success: false,
      message: "Tipe reaksi tidak valid",
    });
  }

  if (!["add", "remove"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Action tidak valid",
    });
  }

  try {
    // Cek artikel exists
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    console.log("Current article counts:", {
      like_count: article.like_count,
      dislike_count: article.dislike_count,
    });

    // Handle different scenarios
    if (
      action === "add" &&
      currentReaction &&
      currentReaction !== reactionType
    ) {
      // User is changing reaction - remove old first, then add new
      console.log(
        "User changing reaction from",
        currentReaction,
        "to",
        reactionType
      );

      // Remove old reaction
      if (currentReaction === "like") {
        await updateLikeCount(id, false); // decrement like
      } else {
        await updateDislikeCount(id, false); // decrement dislike
      }

      // Add new reaction
      if (reactionType === "like") {
        await updateLikeCount(id, true); // increment like
      } else {
        await updateDislikeCount(id, true); // increment dislike
      }
    } else if (action === "add") {
      // User adding new reaction
      console.log("User adding new reaction:", reactionType);

      if (reactionType === "like") {
        await updateLikeCount(id, true);
      } else {
        await updateDislikeCount(id, true);
      }
    } else if (action === "remove") {
      // User removing existing reaction
      console.log("User removing reaction:", reactionType);

      if (reactionType === "like") {
        await updateLikeCount(id, false);
      } else {
        await updateDislikeCount(id, false);
      }
    }

    // Ambil data artikel terbaru untuk response
    const updatedArticle = await getArticleById(id);

    console.log("Updated article counts:", {
      like_count: updatedArticle.like_count,
      dislike_count: updatedArticle.dislike_count,
    });

    // Handle NULL values in response
    const likes =
      updatedArticle.like_count !== null ? updatedArticle.like_count : 0;
    const dislikes =
      updatedArticle.dislike_count !== null ? updatedArticle.dislike_count : 0;

    res.json({
      success: true,
      message:
        action === "add"
          ? "Reaksi berhasil ditambahkan"
          : "Reaksi berhasil dihapus",
      data: {
        likes: likes,
        dislikes: dislikes,
      },
    });
  } catch (error) {
    console.error("Error handling reaction:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses reaksi",
      error: error.message,
    });
  }
};

const ArticleTaskService = {
  fetchArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

const ReactionTaskService = {
  handleReaction,
};

module.exports = {
  ArticleTaskService,
  ReactionTaskService,
};
