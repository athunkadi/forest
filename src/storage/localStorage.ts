import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser, CaptureNote, StoredLocation } from "../types";

const CAPTURE_NOTES_KEY = "foresttrack:capture-notes";
const ONBOARDED_KEY = "foresttrack:onboarded";
const AUTH_USER_KEY = "foresttrack:auth-user";
const LAST_LOCATION_KEY = "foresttrack:last-location";

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

export async function getAuthUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(AUTH_USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export async function saveAuthUser(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export async function removeAuthUser(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_USER_KEY);
}

export async function getLastKnownLocation(): Promise<StoredLocation | null> {
  const raw = await AsyncStorage.getItem(LAST_LOCATION_KEY);
  return raw ? (JSON.parse(raw) as StoredLocation) : null;
}

export async function saveLastKnownLocation(location: StoredLocation): Promise<void> {
  await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
}
