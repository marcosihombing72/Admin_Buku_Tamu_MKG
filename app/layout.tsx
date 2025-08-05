import "@/app/globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ProtectedRoute from "@/components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buku Tamu Admin ",
  description: "Buku Tamu Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <ProtectedRoute>{children}</ProtectedRoute>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </body>
    </html>
  );
}
