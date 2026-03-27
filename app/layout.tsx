import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/language";

export const metadata: Metadata = {
  title: "Pharmaco Connect",
  description: "Bangladesh Pharmacy CRM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}