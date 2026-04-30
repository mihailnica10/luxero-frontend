import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Label } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@luxero/auth";
import { api } from "@luxero/api-client";
import type { ApiResponse, AuthResponse } from "@luxero/types";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.post<ApiResponse<AuthResponse>>("/api/auth/login", { email, password }),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.user);
      navigate(res.data.user.isAdmin ? "/admin" : "/dashboard", { replace: true });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  const errorMessage = mutation.error instanceof Error ? mutation.error.message : null;

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
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" shimmer />
                    <Skeleton className="h-10 w-full" shimmer />
                  </div>
                  <Skeleton className="h-10 w-full" shimmer />
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-gold-gradient">Welcome</span> Back
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Sign in to your account to continue
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {errorMessage}
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm text-gold hover:text-gold-light"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={mutation.isPending}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/sign-up" className="text-gold hover:text-gold-light font-medium">
                      Sign up
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
