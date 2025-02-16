import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import { ScreenSizeProvider } from "../src/context/screenSizeContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreContextProvider>
        <ScreenSizeProvider> 
          <App />
        </ScreenSizeProvider>
      </StoreContextProvider>
    </BrowserRouter>
  </StrictMode>
)
