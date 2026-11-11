import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DEFAULT_PROFILE_EMOJI, DEFAULT_STUDENT_NAME, StudentState } from '../types';
import {
  DEFAULT_KANA_DROP_TIME_LIMITS,
  DEFAULT_SHOP_CATALOG,
  mergeStudentState
} from './storage';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const BOOTSTRAPPED_ADMIN_EMAIL = 'ai.kj1207@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export async function signInWithGoogle(): Promise<User> {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

export async function signOutGoogle(): Promise<void> {
  await signOut(auth);
}

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) return false;
  if (user.email === BOOTSTRAPPED_ADMIN_EMAIL) {
    const adminPath = `admins/${user.uid}`;
    try {
      const ref = doc(db, 'admins', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '관리자',
          role: 'admin',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, adminPath);
    }
    return true;
  }

  const adminPath = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    return snap.exists();
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, adminPath);
  }
}

export async function addAdminByUid(adminUid: string, email: string, displayName: string): Promise<void> {
  const cleanUid = adminUid.trim();
  const path = `admins/${cleanUid}`;
  try {
    await setDoc(doc(db, 'admins', cleanUid), {
      uid: cleanUid,
      email: email.trim().slice(0, 254),
      displayName: displayName.trim().slice(0, 100) || '관리자',
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

function sanitizeStudentPayload(state: StudentState, uid: string) {
  return {
    uid,
    studentName: (state.studentName || DEFAULT_STUDENT_NAME).trim().slice(0, 40) || DEFAULT_STUDENT_NAME,
    profileEmoji: (state.profileEmoji || DEFAULT_PROFILE_EMOJI).trim().slice(0, 16) || DEFAULT_PROFILE_EMOJI,
    profileConfigured: Boolean(state.profileConfigured),
    diagnosticCompleted: Boolean(state.diagnosticCompleted),
    diagnosticResult: state.diagnosticResult || null,
    level: Math.min(200, Math.max(1, Number(state.level) || 1)),
    exp: Math.min(10000000, Math.max(0, Number(state.exp) || 0)),
    coins: Math.min(10000000, Math.max(0, Number(state.coins) || 0)),
    gameExpToday: Math.min(10000, Math.max(0, Number(state.gameExpToday) || 0)),
    gameExpDate: (state.gameExpDate || '').slice(0, 20),
    fontSizeScale:
      state.fontSizeScale === 'large' || state.fontSizeScale === 'xlarge'
        ? state.fontSizeScale
        : 'normal',
    lastStudyLocation: state.lastStudyLocation || null,
    targetLevel: state.targetLevel || 'STAGE0',
    subLevel: Math.min(3, Math.max(1, Number(state.subLevel) || 1)),
    streak: Math.min(3650, Math.max(0, Number(state.streak) || 0)),
    lastStudyDate: (state.lastStudyDate || '').slice(0, 20),
    streakDates: (state.streakDates || []).slice(-366),
    streakProtections: Math.min(50, Math.max(0, Number(state.streakProtections) || 0)),
    currentStageId: (state.currentStageId || 'stage_h_a').slice(0, 64),
    unlockedStages: (state.unlockedStages || ['stage_h_a']).slice(0, 100),
    completedStages: (state.completedStages || []).slice(0, 100),
    learnedKana: (state.learnedKana || []).slice(0, 300),
    bookmarkedKana: (state.bookmarkedKana || []).slice(0, 300),
    learnedVocab: (state.learnedVocab || []).slice(0, 500),
    bookmarkedVocab: (state.bookmarkedVocab || []).slice(0, 500),
    learnedKanji: (state.learnedKanji || []).slice(0, 500),
    bookmarkedKanji: (state.bookmarkedKanji || []).slice(0, 500),
    learnedGrammar: (state.learnedGrammar || []).slice(0, 500),
    fourWeekPlanChecks: (state.fourWeekPlanChecks || []).slice(0, 100),
    kanaStats: state.kanaStats || {},
    srsItems: state.srsItems || {},
    badges: (state.badges || []).slice(0, 100),
    cultureCards: (state.cultureCards || []).slice(0, 100),
    mockExamHistory: (state.mockExamHistory || []).slice(-100),
    wrongNoteEntries: (state.wrongNoteEntries || []).slice(-200),
    shopCatalog: (state.shopCatalog || DEFAULT_SHOP_CATALOG).slice(0, 50),
    purchasedItems: (state.purchasedItems || []).slice(-100),
    gameRecords: state.gameRecords || {
      kanaDropBest: 0,
      kanaDropBestByDifficulty: { easy: 0, normal: 0, hard: 0 },
      kanaDropPlaysToday: 0,
      listeningBest: 0,
      listeningPlaysToday: 0,
      pairMatchBest: 0,
      pairMatchPlaysToday: 0,
      lastGameDate: ''
    },
    studyLogs: state.studyLogs || {},
    dailyMissions: state.dailyMissions || {},
    missionSettings: state.missionSettings || {
      dailyNewChars: 5,
      dailyGameMissions: 1,
      autoWeakReview: true,
      dailyMinutesGoal: 15,
      dailyGameExpCap: 100,
      breakReminderEnabled: true,
      breakReminderMinutes: 40,
      kanaDropTimeLimits: { ...DEFAULT_KANA_DROP_TIME_LIMITS }
    },
    praiseMessages: (state.praiseMessages || []).slice(-50),
    acknowledgedPraiseIds: (state.acknowledgedPraiseIds || []).slice(-100),
    lastBackupAt: (state.lastBackupAt || '').slice(0, 40),
    startDate: (state.startDate || '').slice(0, 20)
  };
}

export async function loadStudentFromCloud(uid: string): Promise<StudentState | null> {
  const path = `students/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'students', uid));
    if (!snap.exists()) return null;
    const data = snap.data() as Partial<StudentState>;
    const normalized = mergeStudentState(
      {
        ...data,
        profileConfigured:
          typeof data.profileConfigured === 'boolean'
            ? data.profileConfigured
            : !(data.profileConfigured === undefined && data.studentName === '지우')
      },
      uid
    );
    return normalized;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function saveStudentToCloud(
  user: User,
  state: StudentState,
  options: { asAdmin?: boolean; targetUid?: string } = {}
): Promise<void> {
  const targetUid = options.targetUid || user.uid;
  const path = `students/${targetUid}`;
  const docRef = doc(db, 'students', targetUid);
  const payload = sanitizeStudentPayload(state, targetUid);

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (targetUid === user.uid && user.email) {
        const privPath = `students/${targetUid}/private/account`;
        try {
          await setDoc(doc(db, 'students', targetUid, 'private', 'account'), {
            uid: targetUid,
            email: user.email.slice(0, 254),
            displayName: (user.displayName || payload.studentName).slice(0, 100),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (privErr) {
          handleFirestoreError(privErr, OperationType.WRITE, privPath);
        }
      }
      return;
    }

    if (options.asAdmin) {
      const { uid: _omitUid, ...updatable } = payload;
      await updateDoc(docRef, {
        ...updatable,
        updatedAt: serverTimestamp()
      });
    } else {
      // Tier 2 update strictly excludes admin-controlled fields (missionSettings, praiseMessages, shopCatalog)
      const {
        uid: _omitUid,
        missionSettings: _omitMissions,
        praiseMessages: _omitPraise,
        shopCatalog: _omitShop,
        ...studentUpdatable
      } = payload;
      await updateDoc(docRef, {
        ...studentUpdatable,
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchAllStudentsForAdmin(): Promise<StudentState[]> {
  const path = 'students';
  try {
    const snaps = await getDocs(collection(db, 'students'));
    return snaps.docs.map((d) => {
      const data = d.data() as Partial<StudentState>;
      return mergeStudentState(
        {
          ...data,
          profileConfigured:
            typeof data.profileConfigured === 'boolean'
              ? data.profileConfigured
              : !(data.profileConfigured === undefined && data.studentName === '지우')
        },
        d.id
      );
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchAdminPinFromCloud(adminUid: string): Promise<string | null> {
  const path = `adminSettings/${adminUid}`;
  try {
    const snap = await getDoc(doc(db, 'adminSettings', adminUid));
    if (!snap.exists()) return null;
    const data = snap.data() as { pinHash?: string };
    return data.pinHash || null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function saveAdminPinToCloud(adminUid: string, pin: string): Promise<void> {
  const path = `adminSettings/${adminUid}`;
  const ref = doc(db, 'adminSettings', adminUid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: adminUid,
        pinHash: pin,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(ref, {
        pinHash: pin,
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
