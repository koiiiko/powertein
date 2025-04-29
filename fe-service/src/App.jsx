import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import '@/components/ui/App.css'

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
