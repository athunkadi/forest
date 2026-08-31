import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { mockGps } from "../data/mockData";
import { saveCaptureNotes } from "../storage/localStorage";
import { Activity, AuthUser, CaptureCategory, CaptureNote, GpsPoint, PlantCondition } from "../types";

// TODO: Replace mockGps with expo-location foreground updates and persisted last-known position.
type NewNoteInput = {
  category: CaptureCategory;
  notes: string;
  condition: PlantCondition;
  gps?: GpsPoint;
  photoUri?: string;
  createdAt?: string;
};

type AppStore = {
  online: boolean;
  isSyncing: boolean;
  authUser: AuthUser | null;
  gps: GpsPoint;
  notes: CaptureNote[];
  activities: Activity[];
  setAuthUser: (user: AuthUser | null) => void;
  setInitialNotes: (notes: CaptureNote[]) => void;
  toggleOnline: () => void;
  addCapturedNote: (input: NewNoteInput) => Promise<CaptureNote>;
  syncPendingRecords: () => Promise<void>;
};

export const AppStoreContext = createContext<AppStore | null>(null);

function createActivityFromNote(note: CaptureNote): Activity {
  return {
    id: `ACT-${note.id}`,
    noteId: note.id,
    icon: note.photoUri ? "📷" : "📍",
    title: note.category.charAt(0).toUpperCase() + note.category.slice(1),
    location: note.gps.block,
    time: new Date(note.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    createdAt: note.createdAt,
    syncStatus: note.syncStatus
  };
}

function getNextNoteId(notes: CaptureNote[]) {
  const nextNumber =
    notes.reduce((largest, note) => {
      const parsed = Number(note.id.replace("TG-", ""));
      return Number.isFinite(parsed) ? Math.max(largest, parsed) : largest;
    }, 0) + 1;

  return `TG-${String(nextNumber).padStart(4, "0")}`;
}

export function useCreateAppStore() {
  const [online, setOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [notes, setNotes] = useState<CaptureNote[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const setInitialNotes = useCallback((loadedNotes: CaptureNote[]) => {
    setNotes(loadedNotes);
    setActivities(loadedNotes.map(createActivityFromNote));
  }, []);

  const persistNotes = useCallback(async (nextNotes: CaptureNote[]) => {
    setNotes(nextNotes);
    await saveCaptureNotes(nextNotes);
  }, []);

  const addCapturedNote = useCallback(
    async (input: NewNoteInput) => {
      const createdAt = input.createdAt ?? new Date().toISOString();
      const noteGps = input.gps ?? mockGps;
      const note: CaptureNote = {
        id: getNextNoteId(notes),
        category: input.category,
        notes: input.notes,
        condition: input.condition,
        gps: noteGps,
        createdAt,
        photoUri: input.photoUri,
        syncStatus: "pending"
      };
      const nextNotes = [note, ...notes];
      const activity = createActivityFromNote(note);

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
      authUser,
      gps: mockGps,
      notes,
      activities,
      setAuthUser,
      setInitialNotes,
      toggleOnline: () => setOnline((value) => !value),
      addCapturedNote,
      syncPendingRecords
    }),
    [activities, addCapturedNote, authUser, isSyncing, notes, online, setInitialNotes, syncPendingRecords]
  );
}

export function useAppStore() {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used inside AppProvider");
  }
  return store;
}
