"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">AI-Carbon Wallet</h1>
          <p className="text-xl mb-8">Redirecting to dashboard...</p>
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    </div>
  );
}
