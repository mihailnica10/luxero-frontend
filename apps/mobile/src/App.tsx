import { AuthProvider, useAuth } from "@luxero/auth";
import { ProtectedRoute } from "@luxero/ui";
import { Route, Routes } from "react-router-dom";
import { MobileLayout } from "./components/layout/MobileLayout";
import { CartPage } from "./pages/CartPage";
import { CompetitionDetailPage } from "./pages/CompetitionDetailPage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { FaqPage } from "./pages/FaqPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignUpPage } from "./pages/SignUpPage";
import { WinnersPage } from "./pages/WinnersPage";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public - no tab bar */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/competitions/:slug" element={<CompetitionDetailPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/winners" element={<WinnersPage />} />
        <Route path="/faq" element={<FaqPage />} />

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
