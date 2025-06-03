import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./features/rifqi-auth/pages/Login";
import SignupPage from "./features/rifqi-auth/pages/SignUp";
import Forum from "./features/ribka-forum/pages/Forum";
import ArticleDetail from "./features/ribka-forum/pages/ArticleDetail";
// import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/forum",
        element: <Forum />,
      },
      {
        path: "/forum/:id",
        element: <ArticleDetail />,
      },
      //   {
      //     path: 'protein-calculator',
      //     element: <ProteinCalculatorPage />,
      //   },
      // Add more protected routes here if needed
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  // Legacy auth route (redirect to login)
  {
    path: "/auth",
    element: <LoginPage />,
  },
]);

export default router;
