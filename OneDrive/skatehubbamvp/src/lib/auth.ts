import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut as fbSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function signup(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  const ref = doc(db, "users", cred.user.uid);
  await setDoc(ref, {
    uid: cred.user.uid,
    email,
    createdAt: serverTimestamp(),
    trialStart: serverTimestamp(),
    // 14-day trial window computed client-side
  }, { merge: true });
  return cred.user;
}

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function profile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.data();
}

export async function signOut() {
  await fbSignOut(auth);
}
export function subscribeAuth(cb: Parameters<typeof onAuthStateChanged>[1]) {
  return onAuthStateChanged(auth, cb);
}