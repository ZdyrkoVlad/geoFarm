import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Force landscape orientation when supported
screen.orientation?.lock?.('landscape').catch(() => {/* not supported or not fullscreen */});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
