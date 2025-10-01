// tests/mvp-core.test.ts
import { describe, it, expect } from "vitest";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, connectAuthEmulator } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, connectStorageEmulator } from "firebase/storage";

describe("SkateHubba MVP core", () => {
  // Use fake/demo config to avoid touching production
  const app = initializeApp({
    apiKey: "fake",
    authDomain: "fake",
    projectId: "demo-project",
    storageBucket: "demo-bucket",
    messagingSenderId: "fake",
    appId: "fake",
  });

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  if (process.env.NODE_ENV !== "production") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFirestoreEmulator(db, "127.0.0.1", 8085);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  }

  it("should initialize Firebase app", () => {
    expect(app).toBeDefined();
  });

  it("should expose auth, db, and storage services", () => {
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
  });

  it("should sign in anonymously", async () => {
    const result = await signInAnonymously(auth);
    expect(result.user).toBeDefined();
  });

  it("should write and read a Firestore doc", async () => {
    const refDoc = doc(db, "tests", "sample");
    await setDoc(refDoc, { ok: true });
    const snap = await getDoc(refDoc);
    expect(snap.exists()).toBe(true);
    expect(snap.data()?.ok).toBe(true);
  });

  it.skip("should upload and fetch from Storage", async () => {
    const fileRef = ref(storage, "tests/hello.txt");
    await uploadString(fileRef, "hello world");
    const url = await getDownloadURL(fileRef);
    expect(url).toContain("hello.txt");
  });
});
