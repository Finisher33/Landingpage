
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { UserRegistration, FirebaseSettings } from '../types';
import { STORAGE_KEY_FIREBASE_CONFIG } from '../constants';

const DEFAULT_CONFIG: FirebaseSettings = {
  apiKey: "AIzaSyBgBT6XXcdNzrlc5_koQeFHel7JeF3gD1Q",
  authDomain: "nowlandingpage.firebaseapp.com",
  projectId: "nowlandingpage",
  storageBucket: "nowlandingpage.firebasestorage.app",
  messagingSenderId: "588170059145",
  appId: "1:588170059145:web:3056ca08a7aa53c6e91558",
  measurementId: "G-8E7JE88YFM"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const getStoredFirebaseConfig = (): FirebaseSettings => {
  const stored = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
};

const initFirebase = () => {
  const config = getStoredFirebaseConfig();
  if (!config.apiKey || !config.projectId) return null;

  try {
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    return null;
  }
};

export const saveRegistration = async (data: UserRegistration): Promise<boolean> => {
  try {
    const firestore = db || initFirebase();
    if (!firestore) throw new Error("Firestore is not initialized");
    await addDoc(collection(firestore, "registrations"), {
      ...data,
      serverTimestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Firebase 저장 실패:', error);
    return false; 
  }
};

export const fetchAllRegistrations = async (): Promise<UserRegistration[]> => {
  try {
    const firestore = db || initFirebase();
    if (!firestore) throw new Error("Firestore is not initialized");

    const q = query(collection(firestore, "registrations"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    const results: UserRegistration[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as UserRegistration);
    });
    
    return results;
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
    return [];
  }
};
