"use client";

import React from "react";

export default function DebugPage() {
  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Debug Contracts</h1>
          <p className="text-xl mb-8">Contract debugging and testing interface coming soon...</p>
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    </div>
  );
}
