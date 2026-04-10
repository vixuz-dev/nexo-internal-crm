import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.jsx'
import CustomToaster from './components/CustomToaster'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomToaster />
    <App />
  </StrictMode>,
)
