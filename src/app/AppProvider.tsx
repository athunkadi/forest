import { PropsWithChildren, useEffect, useRef } from "react";
import { getAuthUser, getCaptureNotes, saveCaptureNotes } from "../storage/localStorage";
import { AppStoreContext, useCreateAppStore } from "../store/useAppStore";
import { CaptureNote } from "../types";

const seedNoteIds = new Set(["TG-0044", "TG-0043", "TG-0042", "TG-0040"]);

function removeSeedNotes(notes: CaptureNote[]) {
  return notes.filter((note) => !seedNoteIds.has(note.id));
}

export function AppProvider({ children }: PropsWithChildren) {
  const store = useCreateAppStore();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) {
      return;
    }

    hydrated.current = true;

    async function hydrate() {
      const savedUser = await getAuthUser();
      store.setAuthUser(savedUser);

      const savedNotes = await getCaptureNotes();
      if (savedNotes) {
        const userNotes = removeSeedNotes(savedNotes);
        store.setInitialNotes(userNotes);
        if (userNotes.length !== savedNotes.length) {
          await saveCaptureNotes(userNotes);
        }
        return;
      }

      await saveCaptureNotes([]);
    }

    hydrate();
  }, [store]);

  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
}
