import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleForm from "../components/FormArticle";
import axios from "axios";
import AppsLayout from "../../../components/layout";
import BackButton from "../components/HandleBack";

export default function EditArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/forum/articles/${id}`)
      .then((res) => setArticle(res.data))
      .catch((err) => console.error("Gagal ambil artikel:", err));
  }, [id]);

  return (
    <AppsLayout>
      <div className="max-w-none mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/forum/my"/>
          <h1 className="text-2xl font-bold">Edit Artikel</h1>
        </div>
        {article ? (
          <ArticleForm initialData={article} articleId={id} />
        ) : (
          <p>Memuat data artikel...</p>
        )}
      </div>
    </AppsLayout>
  );
}
