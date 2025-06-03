// features/ribka-forum/pages/ArticleDetail.jsx

import { useParams } from "react-router-dom";

const mockArticles = [ /* paste mockArticles yang sama di sini */ ];

const ArticleDetail = () => {
  const { id } = useParams();
  const article = mockArticles.find((item) => item.id === parseInt(id));

  if (!article) return <div>Artikel tidak ditemukan</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {article.image && article.image !== "null" && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {article.date} | {article.author}
      </p>
      <p className="text-gray-700 leading-relaxed mb-8">{article.content}</p>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500">
          Like
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400">
          Unlike
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;
