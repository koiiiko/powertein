// Router config
import { createBrowserRouter } from 'react-router-dom';

// Import your pages
import HomePage from './pages/Home';
import AuthPage from './features/rifqi-auth/pages/Login';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/auth',
        element: <AuthPage />,
    }
]);

export default router;