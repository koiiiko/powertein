import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, X, Image } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import SimpleRichTextEditor from "./ArticleEditor";

export default function ArticleForm({
  initialData = {},
  articleId = null,
  onSuccess,
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;
  const user_id = user?.id;

  useEffect(() => {
    if (articleId && initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");

      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData, articleId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("File harus berupa gambar!");
        return;
      }

      try {
        const options = {
          maxSizeMB: 0.06, // Target sekitar 60KB
          maxWidthOrHeight: 800, // Resize jika perlu (boleh disesuaikan)
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        if (compressedFile.size > 64 * 1024) {
          setMessage(
            "Gambar tidak dapat dikompres di bawah 64KB. Silakan pilih gambar lain."
          );
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result.split(",")[1]); // Base64 tanpa prefix
          setImagePreview(reader.result);
          setMessage("");
        };
        reader.readAsDataURL(compressedFile);

        setImageFile({
          name: compressedFile.name,
          size: (compressedFile.size / 1024).toFixed(1),
          type: compressedFile.type,
        });
      } catch (error) {
        console.error(error);
        setMessage("Gagal mengompres gambar.");
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
    setImagePreview(null);

    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  };

  const countWords = (html) => {
    const text = html
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.split(" ").length : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content)
      return setMessage("Judul dan isi tidak boleh kosong.");
    if (title.length < 10 || title.length > 50)
      return setMessage("Judul harus 10–50 karakter.");
    if (countWords(content) < 300 || countWords(content) > 5000)
      return setMessage("Isi artikel harus 300–5000 kata.");

    const payload = { title, content, username, user_id, image };
    try {
      if (articleId) {
        await axios.put(
          `http://localhost:5000/forum/articles/${articleId}`,
          payload
        );
        setMessage("Artikel berhasil diperbarui!");
        navigate(`/forum/${articleId}`);
      } else {
        await axios.post("http://localhost:5000/forum/articles", payload);
        setMessage("Artikel berhasil dibuat!");
        setTitle("");
        setContent("");
        setImage(null);
        setImageFile(null);
        setImagePreview(null);

        // Fetch artikel terbaru untuk mendapatkan ID
        try {
          const articlesResponse = await axios.get(
            "http://localhost:5000/forum/articles"
          );
          const articles = articlesResponse.data;
          // Cari artikel dengan judul yang sama (artikel terbaru)
          const newArticle = articles.find(
            (article) =>
              article.title === title && article.username === username
          );
          if (newArticle) {
            navigate(`/forum/${newArticle.id}`);
          } else {
            navigate("/forum");
          }
        } catch {
          navigate("/forum");
        }
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.includes("berhasil")
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Judul Artikel */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Judul Artikel*
          </label>
          <input
            type="text"
            placeholder="Input field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border-0 bg-[#F1F4F9] rounded-lg placeholder-gray-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500">
            Judul harus terdiri dari 10-50 karakter
          </p>
        </div>

        {/* Isi Artikel */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Isi Artikel*
          </label>
          <SimpleRichTextEditor value={content} onChange={setContent} />
          <p className="text-xs text-gray-500">
            Artikel harus antara 300 - 5000 kata
          </p>
        </div>

        {/* Gambar Thumbnail */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Thumbnail
            </label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-center gap-4">
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ganti Gambar
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-[#F1F4F9] rounded-lg flex items-center justify-center">
                    <Image size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="px-6 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      Pilih Gambar
                    </label>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Pengunggahan gambar thumbnail bersifat opsional
            </p>
          </div>

          {/* File Info */}
          {imageFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle
                  size={20}
                  className="text-green-600 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Gambar berhasil dipilih
                  </p>
                  <p className="text-xs text-green-600">
                    {imageFile.name} ({imageFile.size} KB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            {articleId ? "Simpan Perubahan" : "Simpan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
}
