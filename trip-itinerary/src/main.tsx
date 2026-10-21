import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <LoadingProvider>
                    <App/>
                </LoadingProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
