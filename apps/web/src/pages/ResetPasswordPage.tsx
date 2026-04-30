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

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({
      newPassword,
      confirmPassword,
    }: {
      newPassword: string;
      confirmPassword: string;
    }) => {
      if (newPassword !== confirmPassword) {
        return Promise.reject(new Error("Passwords do not match"));
      }
      if (newPassword.length < 8) {
        return Promise.reject(new Error("Password must be at least 8 characters"));
      }
      const token = new URLSearchParams(window.location.search).get("token");
      return api.post<ApiResponse<unknown>>(`/api/auth/reset-password?token=${token}`, {
        newPassword,
      });
    },
    onSuccess: () => {
      // success state handled by mutation.isSuccess
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setClientError(null);
    mutation.mutate({ newPassword, confirmPassword });
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
                  <span className="text-gold-gradient">Password Reset!</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Your password has been reset successfully.
                </p>
              </div>
              <Link to="/auth/login">
                <Button className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold">
                  Sign In
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
                    <Skeleton className="h-4 w-36" shimmer />
                    <Skeleton className="h-10 w-full" shimmer />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" shimmer />
                    <Skeleton className="h-10 w-full" shimmer />
                  </div>
                  <Skeleton className="h-10 w-full" shimmer />
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-gold-gradient">New Password</span>
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Create a new secure password for your account
                  </p>
                </div>

                {(mutation.error || clientError) && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {clientError || (mutation.error instanceof Error ? mutation.error.message : "Failed to reset password.")}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
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
                        Resetting...
                      </span>
                    ) : (
                      "Reset Password"
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
