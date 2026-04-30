import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Label } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successEmail, setSuccessEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (email: string) =>
      api.post<ApiResponse<{ message: string }>>("/api/auth/forgot-password", { email }),
    onSuccess: () => {
      setSuccessEmail(email);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.reset();
    mutation.mutate(email);
  }

  if (mutation.isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-xl border border-gold/10 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-gold-gradient">Check Your Email</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  If an account exists for <strong>{successEmail}</strong>, we&apos;ve sent password reset instructions.
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center mb-4">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button
                  type="button"
                  className="text-gold hover:text-gold-light"
                  onClick={() => { mutation.reset(); setSuccessEmail(""); }}
                >
                  try again
                </button>
                .
              </p>
              <Link to="/auth/login">
                <Button variant="outline" className="w-full border-gold/30 hover:bg-gold/10">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border border-gold/10 p-8">
            {mutation.isPending ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Skeleton className="h-8 w-48 mx-auto mb-3" shimmer />
                  <Skeleton className="h-4 w-full mb-1" shimmer />
                  <Skeleton className="h-4 w-3/4 mx-auto" shimmer />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" shimmer />
                    <Skeleton className="h-10 w-full" shimmer />
                  </div>
                  <Skeleton className="h-10 w-full" shimmer />
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-gold-gradient">Reset Password</span>
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                {mutation.error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {mutation.error instanceof Error ? mutation.error.message : "Something went wrong."}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={mutation.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link to="/auth/login" className="text-gold hover:text-gold-light font-medium">
                      Sign in
                    </Link>
                  </p>
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
