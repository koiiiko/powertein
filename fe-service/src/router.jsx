// Router config
import { createBrowserRouter } from 'react-router-dom';

// Import your pages
import HomePage from './pages/Home';
import AuthPage from './features/rifqi-auth/pages/Login';
import ProteinCalculatorPage from './features/radit-calculator/pages/ProteinCalculator';
import Layout from './components/layout';

const router = createBrowserRouter([
    {
        path: '/',
 element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthPage />,
    }
]);

router.routes[0].children.push({
    path: '/protein-calculator',
    element: <ProteinCalculatorPage />,
});

export default router;