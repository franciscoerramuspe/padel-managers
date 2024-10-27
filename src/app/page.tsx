"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import GoogleButton from "../components/GoogleButton";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-6xl font-bold text-black mb-8">Bienvenido a Padel Manager</h1>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <GoogleButton className="px-6 py-3 text-lg font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-colors duration-300 shadow-lg" />
      </div>
    </div>
  );
}
