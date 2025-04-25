// Homepage 
import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to Powertein</h1>
            <div className="flex gap-4">
                <Link to="/auth" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Auth
                </Link>
            </div>
        </div>
    );
};

export default Homepage;