"use client";

import React from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";

export default function OffsetsPage() {
  return (
    <ProtectedRoute>
      <WithRoleGuard>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Offsets</h1>
              <p className="text-xl mb-8">Role-gated area for managing carbon offsets</p>
              <div className="bg-base-100 p-8 rounded-3xl max-w-2xl mx-auto">
                <div className="alert">
                  <span>Coming soon: offset browsing and retirement flow.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}


