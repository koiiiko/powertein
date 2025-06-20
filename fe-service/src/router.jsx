import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute.jsx";
import SignupPage from "./features/rifqi-auth/pages/Signup.jsx";
import LoginPage from "./features/rifqi-auth/pages/Login.jsx";
import Chatbot from "./features/rifqi-chatbot/pages/Chatbot.jsx";
import HomePage from "./pages/Home.jsx";
import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator.jsx';
import Forum from "./features/ribka-forum/pages/Forum.jsx";
import ArticleDetail from "./features/ribka-forum/pages/ArticleDetail.jsx";
import MyArticles from "./features/ribka-forum/pages/MyArticle.jsx";
import CreateArticle from "./features/ribka-forum/pages/CreateArticle.jsx";
import EditArticle from "./features/ribka-forum/pages/EditArticle.jsx";
import ProductListPage from "./features/auzan-proteinmart/pages/ProductListPage.jsx";
import ProductDetailPage from "./features/auzan-proteinmart/pages/ProductDetailPage.jsx";

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
