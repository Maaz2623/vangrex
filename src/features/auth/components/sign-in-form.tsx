"use client";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export const SignInForm = () => {
  const [loading, setLoading] = useState(false);

  const signIn = (provider: "google" | "github") => {
    
    authClient.signIn.social(
      {
        provider: provider,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onError: () => {
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    );
  };

  return (
    <fieldset disabled={loading}>
      <main className="min-h-screen bg-background">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Left - Sign In */}
          <div className="flex items-center justify-center px-6 py-12 lg:px-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-bold tracking-tight"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background font-bold">
                  V
                </div>
                Vangrex
              </Link>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Welcome, Builder
                </h1>

                <p className="text-sm text-muted-foreground">
                  Sign in to continue building with Vangrex.
                </p>
              </div>

              {/* OAuth Social Providers */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="h-11 w-full gap-2 border-slate-200"
                  type="button"
                  onClick={() => signIn("google")}
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="h-11 w-full gap-2 border-slate-200"
                  type="button"
                  onClick={() => signIn("github")}
                >
                  <FaGithub className="size-4" />
                  Continue with GitHub
                </Button>
              </div>

              {/* Signup */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-blue-600 underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>

              {/* Terms */}
              <p className="px-4 text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Right - Image Section */}
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src="/auth/auth-cover.png"
              alt="AI workflow visualization"
              fill
              priority
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
              <div className="max-w-xl space-y-5">
                <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md">
                  Visual AI Orchestration Platform
                </div>

                <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                  Build with <span className="text-sky-400">AI teams</span>,
                  <br />
                  not AI tools.
                </h2>

                <p className="max-w-lg text-sm leading-6 text-white/70">
                  Design intelligent workflows, connect AI agents and tools, and
                  turn complex ideas into real applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </fieldset>
  );
};
