"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  // status: "loading" | "authenticated" | "unauthenticated"
  const router = useRouter();
  const { login, isLoading, error: backendError } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
        // Sync with Backend
        login({
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.image || "",
            provider: "google",
            oauth_id: (session.user as any).id || "", 
        }).then(() => {
            router.push("/dashboard");
        }).catch(() => {
            // Error is already in store
        });
    }
  }, [status, session, login, router]);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
        <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-center">QuickChat </h1>
            
            {backendError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong className="font-bold">Login Failed: </strong>
                    <span className="block sm:inline">{backendError || "Failed to connect to server"}</span>
                </div>
            )}

            <button 
                onClick={handleGoogleLogin}
                disabled={status === "loading" || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {status === "loading" || isLoading ? "Signing in..." : "Continue with Google"}
            </button>
            <p className="mt-4 text-xs text-center text-gray-500">
                Secure Login powered by NextAuth & Google
            </p>
        </div>
    </div>
  );
}
