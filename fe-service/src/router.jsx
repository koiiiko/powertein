import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import SignupPage from "./features/rifqi-auth/pages/SignUp";
import LoginPage from "./features/rifqi-auth/pages/Login";
import HomePage from "./pages/Home";
import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator';
import Forum from "./features/ribka-forum/pages/Forum";
import ArticleDetail from "./features/ribka-forum/pages/ArticleDetail";
import MyArticles from "./features/ribka-forum/pages/MyArticle";
import CreateArticle from "./features/ribka-forum/pages/CreateArticle";
import EditArticle from "./features/ribka-forum/pages/EditArticle";
import ProductListPage from "./features/auzan-proteinmart/pages/ProductListPage"; // Import ProductListPage

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
    element: <ProteinCalculatorPage />,
  },
  {
    path: "/forum",
    element: <Forum />,
  },
  {
    path: "/forum/:id",
    element: <ArticleDetail />,
  },
  {
    path: "/forum/new",
    element: <CreateArticle />,
  },
  {
    path: "/forum/my",
    element: <MyArticles />,
  },

  {
    path: "/forum/edit/:id",
    element: <EditArticle />,
  },
  { // New route for ProteinMart
    path: "/protein-mart",
    element: (
        <ProductListPage />
    ),
  },
  
]);

export default router;
