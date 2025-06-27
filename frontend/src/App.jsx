import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Pendant le check auth, on affiche un loader plein écran
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      
      <main className="pt-16 min-h-[calc(100vh-4rem)]"> 
        {/* padding top égal à la hauteur navbar fixe */}
        <Routes>
          {/* Routes accessibles seulement si authentifié */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          
          {/* Routes publiques accessibles uniquement si non authentifié */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
          />
          
          {/* Route accessible tout le temps */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Optionnel : une route 404 */}
          <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} replace />} />
        </Routes>
      </main>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
