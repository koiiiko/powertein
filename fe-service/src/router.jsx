// Router config
import { createBrowserRouter } from 'react-router-dom';

// Import your pages
import HomePage from './pages/Home';
import LoginPage from './features/rifqi-auth/pages/Login';
import SignupPage from './features/rifqi-auth/pages/SignUp';
// import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    //   {
    //     path: 'protein-calculator',
    //     element: <ProteinCalculatorPage />,
    //   },
      // Add more protected routes here if needed
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup', 
    element: <SignupPage />,
  },
  // Legacy auth route (redirect to login)
  {
    path: '/auth',
    element: <LoginPage />,
  },
]);

export default router;