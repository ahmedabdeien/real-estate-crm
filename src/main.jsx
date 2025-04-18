import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './AppWrapper'; // ✅ بدّل App بـ AppWrapper
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
      <ToastContainer position="top-center" rtl theme="light" />
    </BrowserRouter>
  </React.StrictMode>
);
