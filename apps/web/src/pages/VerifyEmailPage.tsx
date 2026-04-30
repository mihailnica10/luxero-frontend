import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [resendMessage, setResendMessage] = useState("");

  const email = searchParams.get("email") ?? "";
  const code = searchParams.get("code") ?? "";

  const verifyMutation = useMutation({
    mutationFn: () =>
      api.post<ApiResponse<{ message: string }>>("/api/auth/verify-email", { email, code }),
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      api.post<ApiResponse<{ message: string }>>("/api/auth/resend-verification", { email }),
    onSuccess: () => {
      setResendMessage("Check your inbox — a new code has been sent.");
    },
  });

  useEffect(() => {
    if (!email || !code) return;
    verifyMutation.mutate();
  }, [email, code]);

  function getStatus(): "loading" | "success" | "error" | "expired" {
    if (verifyMutation.isPending) return "loading";
    if (verifyMutation.isSuccess) return "success";
    if (verifyMutation.isError) {
      const msg = verifyMutation.error instanceof Error ? verifyMutation.error.message : "";
      return msg.includes("expired") ? "expired" : "error";
    }
    return "loading";
  }

  const status = getStatus();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border border-gold/10 p-8 text-center">
            {status === "loading" && (
              <div className="bg-card rounded-xl border border-gold/10 p-8">
                <Skeleton className="h-8 w-8 rounded-full mx-auto mb-4" shimmer />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" shimmer />
                <Skeleton className="h-4 w-full mb-1" shimmer />
                <Skeleton className="h-4 w-2/3 mx-auto" shimmer />
              </div>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  <span className="text-gold-gradient">Email Verified!</span>
                </h1>
                <p className="text-muted-foreground text-sm mb-6">Your email has been verified! You can now sign in.</p>
                <Link to="/auth/login">
                  <Button className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold">
                    Sign In
                  </Button>
                </Link>
              </>
            )}

            {(status === "error" || status === "expired") && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Verification Failed</h1>
                <p className="text-muted-foreground text-sm mb-6">
                  {status === "expired"
                    ? "This verification code has expired."
                    : "Invalid verification code. Please check your email and try again."}
                </p>

                {status === "expired" && email && (
                  <div className="space-y-3">
                    {resendMessage && (
                      <p className="text-sm text-green-400 bg-green-500/10 p-2 rounded-lg">{resendMessage}</p>
                    )}
                    <Button
                      variant="outline"
                      className="w-full border-gold/30 hover:bg-gold/10"
                      onClick={() => resendMutation.mutate()}
                      disabled={resendMutation.isPending}
                    >
                      {resendMutation.isPending ? "Sending..." : "Resend Verification Email"}
                    </Button>
                  </div>
                )}

                <div className="mt-4">
                  <Link to="/auth/login" className="text-sm text-gold hover:text-gold-light">
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}