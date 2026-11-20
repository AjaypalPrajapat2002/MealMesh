import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {GoogleOAuthProvider} from "@react-oauth/google"
import { AppProvider } from "./context/AppContext.tsx";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketContext.tsx";



export const authService =
  import.meta.env.VITE_AUTH_SERVICE_URL || "https://mealmesh-auth.onrender.com";
export const restaurantService =
  import.meta.env.VITE_RESTAURANT_SERVICE_URL || "https://mealmesh-restaurant-service.onrender.com";
export const utilsService =
  import.meta.env.VITE_UTILS_SERVICE_URL || "https://mealmesh-utils-service.onrender.com";
export const realtimeService =
  import.meta.env.VITE_REALTIME_SERVICE_URL || "https://mealmesh-realtime-service.onrender.com";
export const riderService =
  import.meta.env.VITE_RIDER_SERVICE_URL || "https://mealmesh-rider-service.onrender.com";
export const adminService =
  import.meta.env.VITE_ADMIN_SERVICE_URL || "https://mealmesh-admin-service.onrender.com";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "1086945293339-pt1nnlvr9rum3eij5qou9qjfnp8oqfbn.apps.googleusercontent.com"
      }
    >
      <AppProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
