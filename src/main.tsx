import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "../src/css/main.css"
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { UserContextProvider } from './context/UserContext.tsx'
import { PlayerProvider } from './context/PlayerContext.tsx'

const { VITE_AUTH0_DOMAIN: domain, VITE_AUTH0_CLIENT_ID: clientId, VITE_AUTH0_AUDIENCE: audience } = import.meta.env
const redirectUri = window.location.origin

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserContextProvider>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
          audience: audience
        }}>
          <PlayerProvider>
            <App />
          </PlayerProvider>
      </Auth0Provider>
    </BrowserRouter>
  </UserContextProvider>
);
