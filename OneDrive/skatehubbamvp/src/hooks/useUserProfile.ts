// src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/userManagement";

export function useUserProfile(uid: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", uid),
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user profile:", error);
        setProfile(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { profile, loading };
}

export function useUserProfiles(uids: string[]) {
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uids.length === 0) {
      setProfiles({});
      setLoading(false);
      return;
    }

    const unsubscribes: (() => void)[] = [];
    const profilesMap: Record<string, UserProfile> = {};
    let loadedCount = 0;

    uids.forEach((uid) => {
      const unsubscribe = onSnapshot(
        doc(db, "users", uid),
        (doc) => {
          if (doc.exists()) {
            profilesMap[uid] = doc.data() as UserProfile;
          }
          loadedCount++;
          
          if (loadedCount >= uids.length) {
            setProfiles({ ...profilesMap });
            setLoading(false);
          }
        },
        (error) => {
          console.error(`Error fetching profile for ${uid}:`, error);
          loadedCount++;
          
          if (loadedCount >= uids.length) {
            setProfiles({ ...profilesMap });
            setLoading(false);
          }
        }
      );
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [JSON.stringify(uids)]);

  return { profiles, loading };
}