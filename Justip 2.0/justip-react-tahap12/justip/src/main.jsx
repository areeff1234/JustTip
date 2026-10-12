import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { JustipProvider } from './context/JustipContext.jsx';
import './styles/global.css';
import './styles/splash.css';
import './styles/home.css';
import './styles/pages.css';
import './styles/auth.css';
import './styles/roles.css';
import './styles/checkout.css';
import './styles/trip.css';
import './styles/account.css';
import './styles/states.css';
import './styles/chat.css';
import './styles/admin.css';

createRoot(document.getElementById('root')).render(
  <JustipProvider>
    <App />
  </JustipProvider>
);
