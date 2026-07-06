import AsyncStorage from "@react-native-async-storage/async-storage";
import { CaptureNote } from "../types";

const CAPTURE_NOTES_KEY = "foresttrack:capture-notes";
const ONBOARDED_KEY = "foresttrack:onboarded";

export async function getCaptureNotes(): Promise<CaptureNote[] | null> {
  const raw = await AsyncStorage.getItem(CAPTURE_NOTES_KEY);
  return raw ? (JSON.parse(raw) as CaptureNote[]) : null;
}

export async function saveCaptureNotes(notes: CaptureNote[]): Promise<void> {
  await AsyncStorage.setItem(CAPTURE_NOTES_KEY, JSON.stringify(notes));
}

export async function getOnboarded(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(ONBOARDED_KEY);
  return raw === "true";
}

export async function setOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_KEY, value ? "true" : "false");
}
