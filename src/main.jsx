import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "/src/lib/auth-context";

import './index.css'
import '/src/styles/globals.css'

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "/src/pages/app/tailwind.min.css"

import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>

  </StrictMode>,
)
