import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './routes';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './RTK/store';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <Toaster position="top-center" />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
