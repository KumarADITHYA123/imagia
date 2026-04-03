import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Clarity from "@/components/Clarity";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imagia - AI Image Generator",
  description:
    "Generate images using SDXL and Flux models.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {process.env.NODE_ENV === "production" ? <Clarity /> : null}
      <body className={sora.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
