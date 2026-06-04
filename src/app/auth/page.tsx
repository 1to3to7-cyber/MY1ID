"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/hooks/useSupabase";
import { LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW } from "@/lib/validations";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { signIn, loading } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const getLoginAttempts = (): number => {
    const stored = localStorage.getItem("loginAttempts");
    if (!stored) return 0;
    try {
      const { count, time } = JSON.parse(stored);
      if (Date.now() - time > LOGIN_RATE_LIMIT_WINDOW) return 0;
      return count;
    } catch {
      return 0;
    }
  };

  const incrementAttempts = () => {
    const stored = localStorage.getItem("loginAttempts");
    let count = 1;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.time <= LOGIN_RATE_LIMIT_WINDOW) {
          count = parsed.count + 1;
        }
      } catch {}
    }
    localStorage.setItem("loginAttempts", JSON.stringify({ count, time: Date.now() }));
    return count;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const attempts = getLoginAttempts();
    if (attempts >= LOGIN_RATE_LIMIT_MAX) {
      const waitMinutes = Math.ceil(LOGIN_RATE_LIMIT_WINDOW / 60000);
      toast.error(`Too many login attempts. Please wait ${waitMinutes} minutes.`);
      return;
    }

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const result = await signIn(email, password);
    if (result.error) {
      const newCount = incrementAttempts();
      const remaining = LOGIN_RATE_LIMIT_MAX - newCount;
      setError(result.error);
      if (remaining > 0) {
        toast.error(`${remaining} login attempt${remaining !== 1 ? "s" : ""} remaining`);
      } else {
        toast.error("Account temporarily locked. Try again later.");
      }
    } else {
      localStorage.removeItem("loginAttempts");
      toast.success("Welcome back, Bizimana!");
      router.push(redirect);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rwanda-green via-rwanda-yellow to-rwanda-blue flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rwanda-blue/20">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Admin Access
          </h1>
          <p className="text-dark-400 text-sm mt-2">
            Sign in to manage your platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Secure Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {loading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-xs text-dark-500 mt-4">
                Protected area. Unauthorized access is prohibited.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
