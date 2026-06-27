import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './pages/i18next'; // i18n კონფიგურაციის იმპორტი

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);  