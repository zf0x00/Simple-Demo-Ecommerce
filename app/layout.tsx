import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Dashboard",
  description: "Backend Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Create New Store When enter or show modal when no store in db */}
          <ModalProvider />

          {/* Show success or error toast for whole website*/}
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
