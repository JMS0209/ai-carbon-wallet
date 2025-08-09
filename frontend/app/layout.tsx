import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { AuthProvider } from "~~/context/AuthContext";
import { Navbar } from "~~/components/Navbar";
import "~~/styles/globals.css";
import "@mysten/dapp-kit/dist/index.css";
// Metadata export removed to keep this layout as a client-safe composition wrapper

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <body suppressHydrationWarning>
        <ThemeProvider enableSystem>
          <AuthProvider>
            <ScaffoldEthAppWithProviders>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>
                  {children}
                </main>
              </div>
            </ScaffoldEthAppWithProviders>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
