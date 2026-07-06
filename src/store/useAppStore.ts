import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { initialActivities, initialNotes, mockGps } from "../data/mockData";
import { saveCaptureNotes } from "../storage/localStorage";
import { Activity, CaptureCategory, CaptureNote, GpsPoint, PlantCondition } from "../types";

// TODO: Replace mockGps with expo-location foreground updates and persisted last-known position.
type NewNoteInput = {
  category: CaptureCategory;
  notes: string;
  condition: PlantCondition;
};

type AppStore = {
  online: boolean;
  isSyncing: boolean;
  gps: GpsPoint;
  notes: CaptureNote[];
  activities: Activity[];
  setInitialNotes: (notes: CaptureNote[]) => void;
  toggleOnline: () => void;
  addCapturedNote: (input: NewNoteInput) => Promise<CaptureNote>;
  syncPendingRecords: () => Promise<void>;
};

export const AppStoreContext = createContext<AppStore | null>(null);

export function useCreateAppStore() {
  const [online, setOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notes, setNotes] = useState<CaptureNote[]>(initialNotes);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const setInitialNotes = useCallback((loadedNotes: CaptureNote[]) => {
    setNotes(loadedNotes);
  }, []);

  const persistNotes = useCallback(async (nextNotes: CaptureNote[]) => {
    setNotes(nextNotes);
    await saveCaptureNotes(nextNotes);
  }, []);

  const addCapturedNote = useCallback(
    async (input: NewNoteInput) => {
      const createdAt = new Date().toISOString();
      const nextNumber = notes.length + 45;
      const note: CaptureNote = {
        id: `TG-${String(nextNumber).padStart(4, "0")}`,
        category: input.category,
        notes: input.notes,
        condition: input.condition,
        gps: mockGps,
        createdAt,
        syncStatus: "pending"
      };
      const nextNotes = [note, ...notes];
      const activity: Activity = {
        id: `ACT-${Date.now()}`,
        icon: "📷",
        title: "Foto Tanaman",
        location: mockGps.block,
        time: new Date(createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        syncStatus: "pending"
      };

      setActivities((current) => [activity, ...current]);
      await persistNotes(nextNotes);
      return note;
    },
    [notes, persistNotes]
  );

  const syncPendingRecords = useCallback(async () => {
    if (!online || isSyncing) {
      return;
    }

    // TODO: Replace this mock delay with an authenticated API sync queue.
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));

    const nextNotes = notes.map((note) =>
      note.syncStatus === "pending" || note.syncStatus === "failed"
        ? { ...note, syncStatus: "synced" as const }
        : note
    );

    setActivities((current) =>
      current.map((activity) =>
        activity.syncStatus === "pending" || activity.syncStatus === "failed"
          ? { ...activity, syncStatus: "synced" as const }
          : activity
      )
    );
    await persistNotes(nextNotes);
    setIsSyncing(false);
  }, [isSyncing, notes, online, persistNotes]);

  return useMemo(
    () => ({
      online,
      isSyncing,
      gps: mockGps,
      notes,
      activities,
      setInitialNotes,
      toggleOnline: () => setOnline((value) => !value),
      addCapturedNote,
      syncPendingRecords
    }),
    [activities, addCapturedNote, isSyncing, notes, online, setInitialNotes, syncPendingRecords]
  );
}

export function useAppStore() {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used inside AppProvider");
  }
  return store;
}
