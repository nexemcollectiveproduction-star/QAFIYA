import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UmrahPackage, RegistrationRecord } from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId to getFirestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Return or throw formatted message
  return errInfo;
}

// Test Connection on application boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Firebase Firestore connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using offline capabilities.');
    } else {
      console.info('Firebase connection initialized:', (error as Error).message);
    }
    return false;
  }
}

// Run connection check once
testConnection();

// Sign In with Google Popup
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.warn('Google Sign-In:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ----------------- FIRESTORE DATA SERVICES -----------------

// Packages Firestore Service
export async function fetchPackagesFromFirestore(): Promise<UmrahPackage[] | null> {
  const path = 'packages';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return null;
    const list: UmrahPackage[] = [];
    snap.forEach((d) => {
      list.push(d.data() as UmrahPackage);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return null;
  }
}

export async function savePackageToFirestore(pkg: UmrahPackage): Promise<void> {
  const path = `packages/${pkg.id}`;
  try {
    await setDoc(doc(db, 'packages', pkg.id), pkg, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Registrations Firestore Service
export async function fetchRegistrationsFromFirestore(): Promise<RegistrationRecord[] | null> {
  const path = 'registrations';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return null;
    const list: RegistrationRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as RegistrationRecord);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return null;
  }
}

export async function saveRegistrationToFirestore(reg: RegistrationRecord): Promise<void> {
  const path = `registrations/${reg.id}`;
  try {
    await setDoc(doc(db, 'registrations', reg.id), reg, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Settings Firestore Service (Custom Logo & Top Marquee)
export async function fetchSettingsFromFirestore(): Promise<{ logoUrl?: string | null; marqueeAnnouncement?: string } | null> {
  const path = 'settings/app_config';
  try {
    const snap = await getDocs(collection(db, 'settings'));
    let config: { logoUrl?: string | null; marqueeAnnouncement?: string } = {};
    snap.forEach((d) => {
      if (d.id === 'app_config') {
        config = d.data();
      }
    });
    return config;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveSettingsToFirestore(settings: { logoUrl?: string | null; marqueeAnnouncement?: string }): Promise<void> {
  const path = 'settings/app_config';
  try {
    await setDoc(doc(db, 'settings', 'app_config'), {
      id: 'app_config',
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
