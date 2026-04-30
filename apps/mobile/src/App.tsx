import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@luxero/auth";
import { ProtectedRoute } from "@luxero/ui";
import { useAuth } from "@luxero/auth";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HomePage } from "./pages/HomePage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { CartPage } from "./pages/CartPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { CompetitionDetailPage } from "./pages/CompetitionDetailPage";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public - no tab bar */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/competitions/:slug" element={<CompetitionDetailPage />} />

        {/* Tab bar pages */}
        <Route element={<MobileLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Page not found</p>
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
