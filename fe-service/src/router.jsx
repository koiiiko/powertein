import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import SignupPage from "./features/rifqi-auth/pages/SignUp";
import LoginPage from "./features/rifqi-auth/pages/Login";
import Chatbot from "./features/rifqi-chatbot/pages/Chatbot";
import HomePage from "./pages/Home";
import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator';
import Forum from "./features/ribka-forum/pages/Forum";
import ArticleDetail from "./features/ribka-forum/pages/ArticleDetail";
import MyArticles from "./features/ribka-forum/pages/MyArticle";
import CreateArticle from "./features/ribka-forum/pages/CreateArticle";
import EditArticle from "./features/ribka-forum/pages/EditArticle";
import ProductListPage from "./features/auzan-proteinmart/pages/ProductListPage";
import ProductDetailPage from "./features/auzan-proteinmart/pages/ProductDetailPage";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calculator",
    element: (
      <ProtectedRoute>
        <ProteinCalculatorPage />
      </ProtectedRoute>),
  },
  {
    path: "/forum",
    element: (
      <ProtectedRoute>
        <Forum />
      </ProtectedRoute>),
  },
  {
    path: "/forum/:id",
    element: (
      <ProtectedRoute>
        <ArticleDetail />
      </ProtectedRoute>),
  },
  {
    path: "/forum/new",
    element: (
      <ProtectedRoute>
        <CreateArticle />
      </ProtectedRoute>),
  },
  {
    path: "/forum/my",
    element: (
      <ProtectedRoute>
        <MyArticles />
      </ProtectedRoute>),
  },

  {
    path: "/forum/edit/:id",
    element: (
      <ProtectedRoute>
        <EditArticle />
      </ProtectedRoute>),
  },
  {
    path: "/chatbot",
    element: (
      <ProtectedRoute>
        <Chatbot />
      </ProtectedRoute>),
  },
  {
    path: "/mart",
    element: (
      <ProtectedRoute>
        <ProductListPage />
      </ProtectedRoute>

    ),
  },
  {
    path: "/mart/:productId",
    element: (
      <ProtectedRoute>
        <ProductDetailPage />
      </ProtectedRoute>

    ),
  },

]);

export default router;
