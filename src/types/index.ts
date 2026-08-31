import { screens } from "../constants/screens";

export type RootStackParamList = {
  [screens.onboarding]: undefined;
  [screens.login]: undefined;
  [screens.home]: undefined;
  [screens.profile]: undefined;
  [screens.map]: undefined;
  [screens.capture]: undefined;
  [screens.captureForm]:
    | {
        photoUri?: string;
        capturedAt?: string;
        gps?: GpsPoint;
      }
    | undefined;
  [screens.captureSuccess]: { noteId?: string } | undefined;
  [screens.history]: undefined;
  [screens.historyDetail]: { noteId: string };
  [screens.sync]: undefined;
  [screens.tracking]: undefined;
};

export type AuthProvider = "google" | "credentials";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  provider: AuthProvider;
};

export type StoredLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  updatedAt: string;
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
  noteId?: string;
  icon: string;
  title: string;
  location: string;
  time: string;
  createdAt?: string;
  syncStatus: SyncStatus;
};

export type HistoryGroup = {
  date: string;
  items: CaptureNote[];
};
