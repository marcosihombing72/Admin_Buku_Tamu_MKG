"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Daftar halaman yang butuh login
const protectedPaths = ["/dashboard", "/kelolabukutamu", "/laporan", "/pengaturan", "/profilsaya", "/testBukuTamu"];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn");

    if (isProtected && !isLoggedIn) {
      sessionStorage.setItem("needLoginWarning", "true"); // flag untuk tampilkan toast di /
      toast.warning("Anda harus login terlebih dahulu!");
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // 🟡 Selama proses cek login
  if (isChecking) {
    // 🟢 Tampilkan langsung halaman login jika di /
    if (pathname === "/") return <>{children}</>;

    // 🔁 Atau bisa tampilkan loader sementara
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Memeriksa sesi login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
