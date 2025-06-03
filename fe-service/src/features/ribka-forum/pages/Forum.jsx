import AppsLayout from "../../../components/layout";
import { useState } from "react";
import { FilePenLine, ArrowUpDown, User2 } from "lucide-react";
import { Link } from "react-router-dom";

const mockArticles = [
  {
    id: 1,
    title: "Ini Adalah Judul Artikel",
    author: "Penulis Artikel",
    date: "8 Juni 2024",
    content:
      "Ini adalah paragraf pembuka dari artikel. Paragraf ini memberikan gambaran singkat...",
    image: "https://via.placeholder.com/300x120", // Gambar tersedia
    cover: true,
  },
  {
    id: 2,
    title: "Artikel Tanpa Gambar",
    author: "Penulis Tanpa Foto",
    date: "4 Maret 2024",
    content: "Artikel ini tidak memiliki gambar. Tapi kontennya tetap menarik!",
    image: null, // Tidak ada gambar
  },
  {
    id: 3,
    title: "Artikel Ketiga",
    author: "Penulis Artikel",
    date: "1 Januari 2024",
    content: "Isi artikel ketiga ini juga menarik dan patut untuk dibaca...",
    image: "https://via.placeholder.com/300x120",
  },
  {
    id: 4,
    title: "Artikel Ketiga",
    author: "Penulis Artikel",
    date: "1 Januari 2024",
    content: "Isi artikel ketiga ini juga menarik dan patut untuk dibaca...",
    image: null,
  },
  {
    id: 5,
    title: "Artikel Ketiga",
    author: "Penulis Artikel",
    date: "1 Januari 2024",
    content: "Isi artikel ketiga ini juga menarik dan patut untuk dibaca...",
    image: "null",
  },
  {
    id: 6,
    title: "Artikel Ketiga",
    author: "Penulis Artikel",
    date: "1 Januari 2024",
    content: "Isi artikel ketiga ini juga menarik dan patut untuk dibaca...",
    image: "null",
  },
  {
    id: 7,
    title: "Artikel Ketiga",
    author: "Penulis Artikel",
    date: "1 Januari 2024",
    content: "Isi artikel ketiga ini juga menarik dan patut untuk dibaca...",
    image: "null",
  },
];

const Forum = () => {
  const [articles] = useState(mockArticles);
  return (
    <AppsLayout>
      {/* Cover Artikel */}
      {articles[0].cover && (
        <div className="w-full bg-gray-200 rounded-xl h-52 p-6 mb-8 shadow-md">
          <p className="text-sm text-gray-500 mb-1">Ini Tanggal Artikel</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {articles[0].title}
          </h3>
          <p className="text-sm text-gray-600">By {articles[0].author}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700">
            Daftar Artikel
          </h2>
          <button className="flex items-center px-2 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
            <ArrowUpDown size={16} className="mr-1" />
          </button>
        </div>
        <div className="flex-1 border-t mx-4 border-gray-300" />
        <div className="flex items-center gap-2">
          <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700">
            <User2 size={16} className="mr-1" />
            Artikel Saya
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700">
            <FilePenLine size={16} className="mr-2" />
            Buat Artikel
          </button>
        </div>
      </div>

      {/* Grid Artikel */}
      <div className="grid md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link to={`/forum/${article.id}`}>
          <div
            key={article.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              {article.image && (
                <img
                  src={article.image}
                  alt={`Gambar untuk ${article.title}`}
                  className="w-full h-28 object-cover rounded mb-3"
                />
              )}
              <h4 className="text-md font-semibold text-gray-800">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">By {article.author}</p>
              <p className="text-sm text-gray-500 line-clamp-3">
                {article.content}
              </p>
            </div>
            <p className="text-xs text-right text-gray-400 mt-3">
              {article.date}
            </p>
          </div>
          </Link>
        ))}
      </div>
    </AppsLayout>
  );
};

export default Forum;
