import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import Head from "next/head";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/lib/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo",
  description: "Todo app od Denise G.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon.ico"
        ></link>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
