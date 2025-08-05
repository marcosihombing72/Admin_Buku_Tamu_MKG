"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderDashboard from "@/components/HeaderDashboard";
import StatCard from "@/components/StatCard";
import GrafikPengunjung from "@/components/GrafikPengunjung";
import PengunjungInstitusi from "@/components/PengunjungIntitusi";

type FilterType = "today" | "week" | "month";

interface TamuData {
  Tanggal_Pengisian: string;
  Pengunjung?: {
    Asal_Pengunjung?: string;
    [key: string]: unknown;
  };
  Keperluan?: string;
  [key: string]: unknown; // Masih bisa ditambahkan jika butuh fleksibel
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("today");
  const [jadwaltamu, setJadwaltamu] = useState<TamuData[]>([]);
  const [jumlahTamu, setJumlahTamu] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);

  const [grafikData, setGrafikData] = useState<{
    today: { hour: string; visitors: number }[];
    week: { hour: string; visitors: number }[];
    month: { hour: string; visitors: number }[];
  }>({
    today: [],
    week: [],
    month: [],
  });

  const groupDataForChart = (
    todayArr: TamuData[],
    weekArr: TamuData[],
    monthArr: TamuData[]
  ) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (dayOfWeek - 1));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
      }).format(date); // e.g. "15 Jul"

    const todayData: Record<string, number> = {};
    const weekData: Record<string, number> = {};
    const monthData: Record<string, number> = {};

    const pushData = (data: TamuData[]) => {
      data.forEach((item) => {
        const raw = item.Tanggal_Pengisian;
        if (!raw) return;

        const tanggal = new Date(raw);
        if (isNaN(tanggal.getTime())) return;

        if (tanggal.toISOString().split("T")[0] === todayStr) {
          const label = formatDate(tanggal);
          todayData[label] = (todayData[label] || 0) + 1;
        }

        if (tanggal >= weekStart && tanggal <= weekEnd) {
          const hari = tanggal.toLocaleDateString("id-ID", {
            weekday: "short",
          });
          weekData[hari] = (weekData[hari] || 0) + 1;
        }

        if (
          tanggal.getMonth() === today.getMonth() &&
          tanggal.getFullYear() === today.getFullYear()
        ) {
          const label = tanggal.getDate().toString();
          monthData[label] = (monthData[label] || 0) + 1;
        }
      });
    };

    pushData(todayArr);
    pushData(weekArr);
    pushData(monthArr);

    const daysOrder = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    const formatObjToArray = (
      obj: Record<string, number>,
      order?: string[]
    ) => {
      const entries = Object.entries(obj);
      if (order) {
        return order
          .filter((key) => obj[key])
          .map((key) => ({ hour: key, visitors: obj[key] }));
      }
      return entries
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([hour, visitors]) => ({ hour, visitors }));
    };

    return {
      today: formatObjToArray(todayData),
      week: formatObjToArray(weekData, daysOrder),
      month: formatObjToArray(monthData),
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const userID = sessionStorage.getItem("user_id");

        if (!userID || !token) {
          console.warn("Token atau User ID kosong");
          return;
        }

        const baseURL =
          "https://buku-tamu-mkg-datbase-production.up.railway.app/api/admin/buku-tamu";

        const headers = {
          "Content-Type": "application/json",
          access_token: token,
          user_id: userID,
        };

        const [hariRes, mingguRes, bulanRes, totalRes] = await Promise.all([
          fetch(`${baseURL}/hari-ini`, { headers }),
          fetch(`${baseURL}/minggu-ini`, { headers }),
          fetch(`${baseURL}/bulan-ini`, { headers }),
          fetch(baseURL, { headers }),
        ]);

        const hari = await hariRes.json();
        const minggu = await mingguRes.json();
        const bulan = await bulanRes.json();
        const total = await totalRes.json();

        setTodayCount(hari.data?.length ?? 0);
        setWeekCount(minggu.data?.length ?? 0);
        setMonthCount(bulan.data?.length ?? 0);
        setJumlahTamu(total.data?.length ?? 0);

        setTodayCount(hari.count || hari.data?.length || 0);
        setWeekCount(minggu.count || minggu.data?.length || 0);
        setMonthCount(bulan.count || bulan.data?.length || 0);
        setJumlahTamu(total.count || total.data?.length || 0);

        const grouped = groupDataForChart(
          hari.data || [],
          minggu.data || [],
          bulan.data || []
        );
        setGrafikData(grouped);
        setJadwaltamu(total.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const filterButtons = [
    { label: "Hari Ini", value: "today" },
    { label: "Minggu Ini", value: "week" },
    { label: "Bulan Ini", value: "month" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto max-h-screen">
        <HeaderDashboard title="Dashboard" />

        <div className="flex items-center justify-between px-7 pt-6">
          <div></div>
          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value as FilterType)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  filter === btn.value
                    ? "bg-[#1A6EB5] text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6">
          <StatCard
            title="Tamu Hari Ini"
            value={`${todayCount}`}
            color="#05429E"
          />
          <StatCard
            title="Tamu Minggu Ini"
            value={`${weekCount}`}
            color="#1A6EB5"
          />
          <StatCard
            title="Tamu Bulan Ini"
            value={`${monthCount}`}
            color="#59A1CE"
          />
          <StatCard
            title="Total Kunjungan"
            value={`${jumlahTamu}`}
            color="#05225E"
          />
        </div>

        <div className="px-6 pb-6">
          <GrafikPengunjung filter={filter} data={grafikData[filter] || []} />
        </div>

        <div>
          <PengunjungInstitusi data={jadwaltamu} />
        </div>
      </div>
    </div>
  );
}
