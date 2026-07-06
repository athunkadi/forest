import { screens } from "../constants/screens";

export type RootStackParamList = {
  [screens.onboarding]: undefined;
  [screens.home]: undefined;
  [screens.map]: undefined;
  [screens.capture]: undefined;
  [screens.captureForm]: undefined;
  [screens.captureSuccess]: { noteId?: string } | undefined;
  [screens.history]: undefined;
  [screens.sync]: undefined;
  [screens.tracking]: undefined;
};

export type SyncStatus = "pending" | "synced" | "failed";
export type CaptureCategory = "tanaman" | "pohon tumbang" | "jejak satwa" | "lainnya";
export type PlantCondition = "Baik" | "Sedang" | "Buruk";

export type GpsPoint = {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  block: string;
  area: string;
};

export type CaptureNote = {
  id: string;
  category: CaptureCategory;
  notes: string;
  condition: PlantCondition;
  gps: GpsPoint;
  createdAt: string;
  photoUri?: string;
  syncStatus: SyncStatus;
};

export type Activity = {
  id: string;
  icon: string;
  title: string;
  location: string;
  time: string;
  syncStatus: SyncStatus;
};

export type HistoryGroup = {
  date: string;
  items: CaptureNote[];
};
