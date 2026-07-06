import { Activity, CaptureNote, GpsPoint } from "../types";

export const mockGps: GpsPoint = {
  latitude: -7.620134,
  longitude: 110.419782,
  accuracy: 4,
  altitude: 312,
  block: "Blok A-14",
  area: "Kawasan Hutan Lindung"
};

export const initialNotes: CaptureNote[] = [
  {
    id: "TG-0044",
    category: "tanaman",
    notes: "Bibit meranti tumbuh baik, kanopi cukup terbuka.",
    condition: "Baik",
    gps: mockGps,
    createdAt: "2026-05-01T10:44:00.000Z",
    syncStatus: "synced"
  },
  {
    id: "TG-0043",
    category: "tanaman",
    notes: "Daun menguning di bagian bawah.",
    condition: "Sedang",
    gps: { ...mockGps, block: "Blok B-02", latitude: -7.621002, longitude: 110.421882 },
    createdAt: "2026-05-01T09:15:00.000Z",
    syncStatus: "pending"
  },
  {
    id: "TG-0042",
    category: "pohon tumbang",
    notes: "Pohon tumbang menutup jalur inspeksi kecil.",
    condition: "Buruk",
    gps: { ...mockGps, block: "Blok A-13", latitude: -7.620552, longitude: 110.419201 },
    createdAt: "2026-05-01T08:32:00.000Z",
    syncStatus: "pending"
  },
  {
    id: "TG-0040",
    category: "tanaman",
    notes: "Titik kontrol pemantauan tanaman.",
    condition: "Baik",
    gps: { ...mockGps, block: "Blok A-11", latitude: -7.618901, longitude: 110.417433 },
    createdAt: "2026-04-30T11:30:00.000Z",
    syncStatus: "synced"
  }
];

export const initialActivities: Activity[] = [
  { id: "A-1", icon: "📍", title: "Tagging", location: "Blok A-12", time: "08:32", syncStatus: "synced" },
  { id: "A-2", icon: "📷", title: "Foto Tanaman", location: "Blok A-13", time: "09:15", syncStatus: "synced" },
  { id: "A-3", icon: "📍", title: "Tagging", location: "Blok B-02", time: "10:44", syncStatus: "pending" },
  { id: "A-4", icon: "🛰️", title: "Tracking", location: "Jalur Utara", time: "11:30", syncStatus: "pending" }
];
