import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId={"533062206850-684bu9q44ah0ip16atvetccrks6qalhg.apps.googleusercontent.com"}>
                <App/>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
