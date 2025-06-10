const {
  getAllArticles,
  getArticleById,
  addArticleToDB,
  updateArticleInDB,
  deleteArticleFromDB
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

const createArticle = async (req, res) => {
  const { title, content, username, user_id, image } = req.body;

  // Validasi awal
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Judul dan isi artikel tidak boleh kosong." });
  }
  if (title.length < 10 || title.length > 50) {
    return res
      .status(400)
      .json({ message: "Judul harus antara 10–50 karakter." });
  }

  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount < 300 || wordCount > 5000) {
    return res
      .status(400)
      .json({ message: "Isi artikel harus antara 300–5000 kata." });
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

  // Validasi awal
  if (!title || !content) {
    return res.status(400).json({ message: 'Judul dan isi artikel tidak boleh kosong.' });
  }
  if (title.length < 10 || title.length > 50) {
    return res.status(400).json({ message: 'Judul harus antara 10–50 karakter.' });
  }

  // Hitung kata dari HTML content
  const plainTextContent = content.replace(/<[^>]*>/g, '').trim();
  const wordCount = plainTextContent.split(/\s+/).length;
  if (wordCount < 300 || wordCount > 5000) {
    return res.status(400).json({ message: 'Isi artikel harus antara 300–5000 kata.' });
  }

  try {
    // Cek apakah artikel ada
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.' });
    }

    // ← PERBAIKAN: Hanya update image jika ada image baru
    const imageToUpdate = image ? image : existingArticle.image;

    // Update artikel
    await updateArticleInDB({ id, title, content, image: imageToUpdate });
    res.status(200).json({ message: 'Artikel berhasil diperbarui.' });
  } catch (error) {
    console.error('Gagal mengupdate artikel:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate artikel.' });
  }
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek apakah artikel ada
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return res.status(404).json({ 
        success: false,
        message: 'Artikel tidak ditemukan.' 
      });
    }

    // Hapus artikel
    const result = await deleteArticleFromDB(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Artikel tidak ditemukan atau sudah dihapus.' 
      });
    }

    console.log(`Article ${id} deleted successfully`);
    res.status(200).json({ 
      success: true,
      message: 'Artikel berhasil dihapus.' 
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat menghapus artikel.',
      error: error.message 
    });
  }
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
