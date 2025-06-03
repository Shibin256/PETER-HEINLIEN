import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
const  ClientID= import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    {/* google authentication provider */}
      <GoogleOAuthProvider clientId={ClientID}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </GoogleOAuthProvider>
    </Provider>
    </StrictMode>,
)
