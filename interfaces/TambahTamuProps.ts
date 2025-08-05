export interface Guest {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDate: string;
  stationDestination: string; // Tambahkan
  signature: string; // Tambahkan
  status: "Sedang Ditinjau" | "Diterima" | "Ditolak";
}

export interface TambahTamuProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: Guest) => void;
}
