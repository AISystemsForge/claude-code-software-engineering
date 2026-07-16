import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { CloudExportProvider } from "@/context/CloudExportContext";
import { ToastProvider } from "@/components/Toast";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Expenzo — Expense Tracker",
  description:
    "A modern, professional expense tracker to manage your personal finances.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <ToastProvider>
          <ExpenseProvider>
            <CloudExportProvider>
              <AppShell>{children}</AppShell>
            </CloudExportProvider>
          </ExpenseProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
