"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import GoogleButton from "@/components/GoogleButton";
// import Logo from "@/components/Logo";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateUserPage() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="flex flex-col items-center mb-12">
        {/* <Logo className="w-20 h-20 mb-4" /> */}
        <h1 className="text-6xl font-bold text-white font-adversecase">
          Padel Managers
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <GoogleButton className="px-4 py-2 text-base w-64" />
      </div>
    </div>
  );
}
