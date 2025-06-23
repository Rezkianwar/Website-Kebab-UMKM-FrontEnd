import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Add custom colors to Tailwind theme
import './tailwind.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
