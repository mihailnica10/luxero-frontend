import { AuthProvider } from "@luxero/auth";
import { ProtectedRoute } from "@luxero/ui";
import { Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { CategoriesAdminPage } from "./pages/admin/CategoriesAdminPage";
import {
  CompetitionNewAdminPage,
  CompetitionsAdminPage,
} from "./pages/admin/CompetitionsAdminPage";
import { InstantPrizesAdminPage } from "./pages/admin/InstantPrizesAdminPage";
import { OrdersAdminPage } from "./pages/admin/OrdersAdminPage";
import { PromoCodesAdminPage } from "./pages/admin/PromoCodesAdminPage";
import { ReferralsAdminPage } from "./pages/admin/ReferralsAdminPage";
import { UsersAdminPage } from "./pages/admin/UsersAdminPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CompetitionDetailPage } from "./pages/CompetitionDetailPage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { ContactPage } from "./pages/ContactPage";
import { DashboardOrdersPage } from "./pages/DashboardOrdersPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DashboardProfilePage } from "./pages/DashboardProfilePage";
import { DashboardReferralsPage } from "./pages/DashboardReferralsPage";
import { DashboardTicketsPage } from "./pages/DashboardTicketsPage";
import { DashboardWinsPage } from "./pages/DashboardWinsPage";
import { EntriesPage } from "./pages/EntriesPage";
import { FaqPage } from "./pages/FaqPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { FreePostalEntryPage } from "./pages/FreePostalEntryPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignUpPage } from "./pages/SignUpPage";
import { TermsPage } from "./pages/TermsPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { WinnersPage } from "./pages/WinnersPage";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/competitions/:slug" element={<CompetitionDetailPage />} />
        <Route path="/entries" element={<EntriesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/winners" element={<WinnersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/free-postal-entry" element={<FreePostalEntryPage />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/orders" element={<DashboardOrdersPage />} />
        <Route path="/dashboard/tickets" element={<DashboardTicketsPage />} />
        <Route path="/dashboard/wins" element={<DashboardWinsPage />} />
        <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
        <Route path="/dashboard/referrals" element={<DashboardReferralsPage />} />

        {/* Admin Pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/competitions"
          element={
            <ProtectedRoute adminOnly>
              <CompetitionsAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/competitions/new"
          element={
            <ProtectedRoute adminOnly>
              <CompetitionNewAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <OrdersAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <UsersAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/promo-codes"
          element={
            <ProtectedRoute adminOnly>
              <PromoCodesAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/instant-prizes"
          element={
            <ProtectedRoute adminOnly>
              <InstantPrizesAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute adminOnly>
              <CategoriesAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/referrals"
          element={
            <ProtectedRoute adminOnly>
              <ReferralsAdminPage />
            </ProtectedRoute>
          }
        />

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
