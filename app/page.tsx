"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const authorized = typeof window !== "undefined" && !!getToken();

  useEffect(() => {
    if (!authorized) {
      router.replace("/login");
    }
  }, [authorized, router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Welcome to the Dashboard
        </h1>
        <Button
          className="mt-8 cursor-pointer"
          onClick={() => router.replace("/logout")}
        >
          Logout
        </Button>
      </main>
    </div>
  );
}
