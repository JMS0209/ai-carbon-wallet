"use client";

import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { AuthProvider } from "~~/context/AuthContext";
import { Header } from "~~/components/Header";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider enableSystem>
      <AuthProvider>
        <ScaffoldEthAppWithProviders>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </ScaffoldEthAppWithProviders>
      </AuthProvider>
    </ThemeProvider>
  );
};
