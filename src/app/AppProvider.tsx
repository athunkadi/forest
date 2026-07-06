import { PropsWithChildren, useEffect, useRef } from "react";
import { initialNotes } from "../data/mockData";
import { getCaptureNotes, saveCaptureNotes } from "../storage/localStorage";
import { AppStoreContext, useCreateAppStore } from "../store/useAppStore";

export function AppProvider({ children }: PropsWithChildren) {
  const store = useCreateAppStore();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) {
      return;
    }

    hydrated.current = true;

    async function hydrate() {
      const savedNotes = await getCaptureNotes();
      if (savedNotes) {
        store.setInitialNotes(savedNotes);
        return;
      }

      await saveCaptureNotes(initialNotes);
    }

    hydrate();
  }, [store]);

  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
}
