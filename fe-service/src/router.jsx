import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import SignupPage from "./features/rifqi-auth/pages/SignUp";
import LoginPage from "./features/rifqi-auth/pages/Login";
import HomePage from "./pages/Home";
import Forum from "./features/ribka-forum/pages/Forum";
import ArticleDetail from "./features/ribka-forum/pages/ArticleDetail";
import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator';

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
    path: "/forum",
    element: <Forum />,
  },
  {
    path: "/forum/:id",
    element: <ArticleDetail />,
  },
  {
    path: "/protein-calculator",
    element: <ProteinCalculatorPage />,
  },
]);

export default router;
