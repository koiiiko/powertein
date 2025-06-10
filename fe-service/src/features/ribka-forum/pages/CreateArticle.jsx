import AppsLayout from "../../../components/layout";
import BackButton from "../components/HandleBack";
import ArticleForm from "../components/FormArticle";

export default function CreateArticle() {
  return (
    <AppsLayout>
      <div className="max-w-none mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">Buat Artikel Kesehatan</h1>
        </div>
        <ArticleForm />
      </div>
    </AppsLayout>
  );
}
