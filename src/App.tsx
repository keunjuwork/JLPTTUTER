import React from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { BreakReminderModal } from './components/BreakReminderModal';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { GameZoneView } from './components/GameZoneView';
import { HomeView } from './components/HomeView';
import { InAppBrowserBanner } from './components/InAppBrowserBanner';
import { InAppBrowserModal } from './components/InAppBrowserModal';
import { LearningLabView } from './components/LearningLabView';
import { PracticeSubTab, PracticeView } from './components/PracticeView';
import { PrintCenterView } from './components/PrintCenterView';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { RecordsView } from './components/RecordsView';
import { ShopView } from './components/ShopView';
import { StudentHeader } from './components/StudentHeader';
import { TextbookGuideBanner } from './components/TextbookGuideBanner';
import { ADVENTURE_STAGES } from './data/adventureRoadmapData';
import { CULTURE_CARDS } from './data/cultureAndBadgesData';
import { DiagnosticEvaluation } from './data/diagnosticTestData';
import { findTextbookCode, PART1_TEXTBOOK_CODES, TextbookCodeEntry } from './data/textbookCodes';
import { useActiveStudyTimer } from './hooks/useActiveStudyTimer';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  addAdminByUid,
  auth,
  checkIsAdmin,
  fetchAdminPinFromCloud,
  fetchAllStudentsForAdmin,
  loadStudentFromCloud,
  saveAdminPinToCloud,
  saveStudentToCloud,
  signInWithGoogle,
  signOutGoogle
} from './lib/firebase';
import {
  attemptAutoExternalBrowserOpen,
  detectInAppBrowser,
  InAppBrowserInfo
} from './lib/inAppBrowser';
import { playSfx, subscribeSoundAttempt, subscribeSpeechPlay } from './lib/speech';
import {
  createInitialStudentState,
  createSamplePopulatedState,
  diffDaysBetweenKeys,
  evaluateBadges,
  exportBackupJson,
  getLocalAdminPin,
  getMissionCountSummary,
  getPendingCloudSync,
  getTodayKey,
  loadLocalStudentState,
  normalizeDailyState,
  parseBackupJson,
  recordKanaAttempt,
  recordStudyActivity,
  saveLocalStudentState,
  setLocalAdminPin,
  setPendingCloudSync
} from './lib/storage';
import {
  AdminSubTab,
  AdventureStage,
  DEFAULT_PROFILE_EMOJI,
  DEFAULT_STUDENT_NAME,
  FontSizeScale,
  JlptLevel,
  KanaDropDifficulty,
  LastStudyLocation,
  MainTab,
  MockExamAttempt,
  PrintSubTab,
  ShopItem,
  StudentState,
  StudySubTab,
  SubDifficulty,
  TextbookCodeProgress,
  TextbookMissionKey,
  ToastItem,
  WrongNoteEntry,
  WrongReasonTag
} from './types';

const PENDING_CODE_STORAGE_KEY = 'ari_pending_textbook_code_v1';

export default function App() {
  const [state, setState] = React.useState<StudentState>(() => loadLocalStudentState());
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const [profileModalMode, setProfileModalMode] = React.useState<'onboarding' | 'edit' | null>(() =>
    state.profileConfigured ? null : 'onboarding'
  );
  const [activeTab, setActiveTab] = React.useState<MainTab>('home');
  const [studySubTab, setStudySubTab] = React.useState<StudySubTab>('kana');
  const [practiceSubTab, setPracticeSubTab] = React.useState<PracticeSubTab>('reading');
  const [selectedRowId, setSelectedRowId] = React.useState<string>('row_a');
  const [printSubTab, setPrintSubTab] = React.useState<PrintSubTab>('rowSheet');
  const [printPairId, setPrintPairId] = React.useState<string>('pair_sa_ki');

  // Firebase Auth, Network & Cloud Sync State
  const isOnline = useOnlineStatus();
  const [firebaseUser, setFirebaseUser] = React.useState<User | null>(null);
  const [isGoogleAdmin, setIsGoogleAdmin] = React.useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = React.useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [hasPendingSync, setHasPendingSync] = React.useState<boolean>(() => getPendingCloudSync());
  const cloudHydratedRef = React.useRef(false);
  const wasOfflineRef = React.useRef(!isOnline);

  // Admin State
  const [adminGateOpen, setAdminGateOpen] = React.useState(false);
  const [adminMode, setAdminMode] = React.useState(false);
  const [adminSubTab, setAdminSubTab] = React.useState<AdminSubTab>('dashboard');
  const [adminPin, setAdminPin] = React.useState<string>(() => getLocalAdminPin());
  const [studentsList, setStudentsList] = React.useState<StudentState[]>([]);
  const [adminSelectedUid, setAdminSelectedUid] = React.useState<string>('');

  // Diagnostic, Break Reminder, Resume Deep-Link & Guard Refs
  const [breakModalOpen, setBreakModalOpen] = React.useState(false);
  const [forceDiagnosticOpen, setForceDiagnosticOpen] = React.useState(false);
  const [resumeTarget, setResumeTarget] = React.useState<{
    kanaChar?: string;
    vocabId?: string;
    kanjiId?: string;
    grammarId?: string;
    readingId?: string;
    listeningId?: string;
    nonce: number;
  }>({ nonce: 0 });
  const backupToastShownRef = React.useRef(false);
  const gameCapToastDateRef = React.useRef('');

  // Textbook Code Deep-Link & Guide State
  const [authReady, setAuthReady] = React.useState(false);
  const [activeTextbookCode, setActiveTextbookCode] = React.useState<string | null>(null);
  const [textbookQuizTrigger, setTextbookQuizTrigger] = React.useState<{
    nonce: number;
    mode: 'row' | 'hiragana_review';
  }>({ nonce: 0, mode: 'row' });
  const quizTriggerCounterRef = React.useRef(0);

  // In-App Browser (KakaoTalk, Naver, Instagram, LINE, etc.) State
  const [inAppInfo] = React.useState<InAppBrowserInfo>(() => detectInAppBrowser());
  const [inAppModalOpen, setInAppModalOpen] = React.useState(false);
  const [inAppBannerDismissed, setInAppBannerDismissed] = React.useState(false);
  const [urlCopied, setUrlCopied] = React.useState(false);
  const lastSoundWarningAtRef = React.useRef(0);

  // Toasts
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const notify = React.useCallback(
    (
      message: string,
      type: ToastItem['type'] = 'info',
      opts?: { actionLabel?: string; onAction?: () => void }
    ) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [
        ...prev.slice(-3),
        { id, message, type, actionLabel: opts?.actionLabel, onAction: opts?.onAction }
      ]);
      setTimeout(
        () => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        },
        opts?.actionLabel ? 7000 : 4000
      );
    },
    []
  );

  // Sync HTML data-font-scale attribute
  React.useEffect(() => {
    document.documentElement.setAttribute('data-font-scale', state.fontSizeScale || 'normal');
  }, [state.fontSizeScale]);

  // Persist to localStorage immediately on state change
  React.useEffect(() => {
    saveLocalStudentState(state);
  }, [state]);

  // Listen to Firebase Auth state & restore cloud records
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setIsGoogleAdmin(false);
        setAdminMode(false);
        setCloudSyncStatus('idle');
        cloudHydratedRef.current = false;
        setAuthReady(true);
        return;
      }

      if (!navigator.onLine) {
        setCloudSyncStatus('idle');
        setAuthReady(true);
        return;
      }

      try {
        const adminOk = await checkIsAdmin(user);
        setIsGoogleAdmin(adminOk);

        if (adminOk) {
          const cloudPin = await fetchAdminPinFromCloud(user.uid);
          if (cloudPin) {
            setAdminPin(cloudPin);
            setLocalAdminPin(cloudPin);
          }
          try {
            const list = await fetchAllStudentsForAdmin();
            if (list.length > 0) setStudentsList(list);
          } catch {
            // ignore list error if no students yet
          }
        }

        const cloudState = await loadStudentFromCloud(user.uid);
        if (cloudState) {
          setState(cloudState);
          setAdminSelectedUid(user.uid);
          cloudHydratedRef.current = true;
          setPendingCloudSync(false);
          setHasPendingSync(false);
          setCloudSyncStatus('synced');
          if (cloudState.profileConfigured) {
            setProfileModalMode(null);
          }
          notify(`${cloudState.studentName}의 클라우드 기록을 불러왔어요!`, 'success');
        } else {
          // First-time cloud save from current local state
          const initialName = state.profileConfigured
            ? state.studentName
            : state.studentName || user.displayName?.split(' ')[0] || DEFAULT_STUDENT_NAME;
          const seeded: StudentState = {
            ...state,
            uid: user.uid,
            studentName: initialName.trim().slice(0, 40) || DEFAULT_STUDENT_NAME,
            profileEmoji: state.profileEmoji || DEFAULT_PROFILE_EMOJI,
            profileConfigured: Boolean(state.profileConfigured)
          };
          setState(seeded);
          setAdminSelectedUid(user.uid);
          await saveStudentToCloud(user, seeded, { asAdmin: adminOk });
          cloudHydratedRef.current = true;
          setPendingCloudSync(false);
          setHasPendingSync(false);
          setCloudSyncStatus('synced');
          notify('Google 계정과 학습 기록을 연결했어요!', 'success');
        }
      } catch {
        setCloudSyncStatus(navigator.onLine ? 'error' : 'idle');
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Capture initial ?code=... QR/URL parameter on mount and keep URL clean
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const rawCode = url.searchParams.get('code');
    if (rawCode !== null) {
      const trimmed = rawCode.trim();
      if (trimmed) {
        try {
          sessionStorage.setItem(PENDING_CODE_STORAGE_KEY, trimmed);
        } catch {
          // ignore sessionStorage failures
        }
      }
      url.searchParams.delete('code');
      const cleanSearch = url.searchParams.toString();
      const cleanUrl = `${url.pathname}${cleanSearch ? `?${cleanSearch}` : ''}${url.hash}`;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, []);

  // In-App Browser Auto-Escape Attempt (Attempt once on mount; open guidance modal if still inside)
  React.useEffect(() => {
    if (!inAppInfo.isInApp) return;

    // Attempt auto-redirect to default browser (Kakao custom scheme, LINE query, Android Chrome intent)
    const attempted = attemptAutoExternalBrowserOpen(inAppInfo);

    // If auto-transition is not supported (iOS Instagram/Naver etc.) or if the app remains in view
    // show the guide modal after a short delay so user knows why sound is not playing.
    const modalTimer = setTimeout(() => {
      setInAppModalOpen(true);
    }, attempted ? 1200 : 400);

    return () => clearTimeout(modalTimer);
  }, [inAppInfo]);

  // Helper to copy current full URL (with query ?code=... intact) to clipboard
  const handleCopyCurrentUrl = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const currentHref = window.location.href;
    const fallbackCopy = () => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = currentHref;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 2500);
        notify('복사했어요. Safari나 Chrome에 붙여 넣어 주세요', 'success');
      } catch {
        notify('복사가 막혔어요. 모달의 주소를 길게 눌러 복사해 주세요.', 'warning');
      }
    };

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(currentHref)
        .then(() => {
          setUrlCopied(true);
          setTimeout(() => setUrlCopied(false), 2500);
          notify('복사했어요. Safari나 Chrome에 붙여 넣어 주세요', 'success');
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  }, [notify]);

  // Listen to sound/speech playback attempts: in in-app browsers, warn user if sound might fail
  React.useEffect(() => {
    if (!inAppInfo.isInApp) return;

    return subscribeSoundAttempt(() => {
      const now = Date.now();
      // Throttle sound warning toast so it doesn't spam (once every 12 seconds)
      if (now - lastSoundWarningAtRef.current > 12000) {
        lastSoundWarningAtRef.current = now;
        notify(
          '앱 안에서는 소리가 나지 않을 수 있어요. 다른 브라우저로 열어 주세요',
          'warning',
          {
            actionLabel: '열기 방법 보기',
            onAction: () => setInAppModalOpen(true)
          }
        );
      }
    });
  }, [inAppInfo.isInApp, notify]);

  // 0.7s Debounced Cloud Sync (queues locally when offline)
  React.useEffect(() => {
    if (!firebaseUser) return;
    if (!isOnline) {
      setPendingCloudSync(true);
      setHasPendingSync(true);
      setCloudSyncStatus('idle');
      return;
    }
    if (!cloudHydratedRef.current) return;

    setCloudSyncStatus('syncing');
    const timer = setTimeout(() => {
      const targetUid = adminMode && adminSelectedUid ? adminSelectedUid : firebaseUser.uid;
      saveStudentToCloud(firebaseUser, state, {
        asAdmin: isGoogleAdmin && adminMode,
        targetUid
      })
        .then(() => {
          setPendingCloudSync(false);
          setHasPendingSync(false);
          setCloudSyncStatus('synced');
        })
        .catch(() => {
          if (!navigator.onLine) {
            setPendingCloudSync(true);
            setHasPendingSync(true);
            setCloudSyncStatus('idle');
          } else {
            setCloudSyncStatus('error');
          }
        });
    }, 700);

    return () => clearTimeout(timer);
  }, [state, firebaseUser, isGoogleAdmin, adminMode, adminSelectedUid, isOnline]);

  const reconnectFlushInFlightRef = React.useRef(false);

  // Flush pending cloud sync automatically upon returning online
  React.useEffect(() => {
    const cameBackOnline = wasOfflineRef.current && isOnline;
    wasOfflineRef.current = !isOnline;
    if (!isOnline || !firebaseUser) return;
    if (!(hasPendingSync || getPendingCloudSync())) return;
    if (reconnectFlushInFlightRef.current) return;

    const targetUid = adminMode && adminSelectedUid ? adminSelectedUid : firebaseUser.uid;
    reconnectFlushInFlightRef.current = true;
    setCloudSyncStatus('syncing');
    saveStudentToCloud(firebaseUser, stateRef.current, {
      asAdmin: isGoogleAdmin && adminMode,
      targetUid
    })
      .then(() => {
        cloudHydratedRef.current = true;
        setPendingCloudSync(false);
        setHasPendingSync(false);
        setCloudSyncStatus('synced');
        if (cameBackOnline) {
          notify('온라인으로 복귀해 대기 중이던 학습 기록을 클라우드에 자동 동기화했어요!', 'success');
        }
      })
      .catch(() => {
        setCloudSyncStatus('error');
      })
      .finally(() => {
        reconnectFlushInFlightRef.current = false;
      });
  }, [isOnline, firebaseUser, hasPendingSync, adminMode, adminSelectedUid, isGoogleAdmin, notify]);

  // Helper to update daily mission completion count inside studyLogs
  const withSyncedMissionLog = React.useCallback((next: StudentState): StudentState => {
    const today = getTodayKey();
    const summary = getMissionCountSummary(next);
    const prevLog = next.studyLogs[today] || {
      studyMinutes: 0,
      gameMinutes: 0,
      quizAttempts: 0,
      quizCorrect: 0,
      missionsCompleted: 0
    };
    return evaluateBadges({
      ...next,
      studyLogs: {
        ...next.studyLogs,
        [today]: {
          ...prevLog,
          missionsCompleted: summary.completed
        }
      }
    });
  }, []);

  const diagnosticOpen =
    !adminMode &&
    !profileModalMode &&
    ((Boolean(state.profileConfigured) && !state.diagnosticCompleted) || forceDiagnosticOpen);

  // Genuine active study & game minute tracker (pauses when hidden / 5m idle / break)
  const studyTimer = useActiveStudyTimer({
    enabled:
      !adminMode &&
      !profileModalMode &&
      !diagnosticOpen &&
      (activeTab === 'study' || activeTab === 'practice' || activeTab === 'game'),
    mode: activeTab === 'game' ? 'game' : 'study',
    breakReminderEnabled: state.missionSettings.breakReminderEnabled ?? true,
    breakReminderMinutes: state.missionSettings.breakReminderMinutes ?? 40,
    pausedForBreak: breakModalOpen,
    onCommitMinute: (mode) => {
      setState((prev) =>
        withSyncedMissionLog(
          recordStudyActivity(prev, mode === 'game' ? { gameMinutes: 1 } : { studyMinutes: 1 })
        )
      );
    },
    onReachBreakThreshold: () => setBreakModalOpen(true)
  });

  // Near daily Game EXP cap warning toast
  React.useEffect(() => {
    if (activeTab !== 'game' || adminMode) return;
    const today = getTodayKey();
    const cap = state.missionSettings?.dailyGameExpCap ?? 100;
    const used = state.gameExpDate === today ? state.gameExpToday || 0 : 0;
    if (cap > 0 && used >= Math.ceil(cap * 0.8) && used < cap && gameCapToastDateRef.current !== today) {
      gameCapToastDateRef.current = today;
      notify('오늘 게임 EXP를 거의 다 채웠어요! 학습실에서 EXP를 더 모아 볼까요?', 'warning');
    }
  }, [activeTab, adminMode, state.gameExpToday, state.gameExpDate, state.missionSettings?.dailyGameExpCap, notify]);

  const handleGoogleLogin = async () => {
    // In-app browsers often block OAuth popups or fail redirect cookies; guide user to native browser
    if (inAppInfo.isInApp) {
      setInAppModalOpen(true);
      notify(
        `[${inAppInfo.appName || '앱 안 브라우저'}]에서는 Google 로그인이 차단될 수 있어요. Safari나 Chrome으로 열어 주세요.`,
        'warning'
      );
      return;
    }

    try {
      await signInWithGoogle();
    } catch {
      notify('Google 로그인 창이 닫혔거나 차단되었어요.', 'warning');
    }
  };

  const handleGoogleLogout = async () => {
    await signOutGoogle();
    notify('로그아웃되었어요. 이 기기(localStorage)에는 기록이 안전하게 남아 있어요.', 'info');
  };

  const handleNavigateTab = (
    tab: MainTab,
    opts?: {
      studySubTab?: StudySubTab;
      practiceSubTab?: PracticeSubTab;
      rowId?: string;
      printSubTab?: PrintSubTab;
      pairId?: string;
    }
  ) => {
    setActiveTab(tab);
    if (opts?.studySubTab) setStudySubTab(opts.studySubTab);
    if (opts?.practiceSubTab) setPracticeSubTab(opts.practiceSubTab);
    if (opts?.rowId) setSelectedRowId(opts.rowId);
    if (opts?.printSubTab) setPrintSubTab(opts.printSubTab);
    if (opts?.pairId) setPrintPairId(opts.pairId);
    setTextbookQuizTrigger((prev) => (prev.nonce === 0 ? prev : { nonce: 0, mode: 'row' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStage = (stage: AdventureStage) => {
    if (!state.unlockedStages.includes(stage.id)) {
      notify('앞 단계 퀴즈를 80% 이상 통과하면 다음 모험이 열려요!', 'info');
      return;
    }
    setState((prev) => ({
      ...prev,
      currentStageId: stage.id,
      ...(stage.world !== 'STAGE0' ? { targetLevel: stage.world } : {})
    }));
    setActiveTab('study');
    if (stage.world !== 'STAGE0') {
      setStudySubTab('vocab');
    } else {
      setStudySubTab('kana');
      if (stage.id === 'stage_basics') {
        setSelectedRowId('basics_preview');
      } else if (stage.rowId) {
        setSelectedRowId(stage.rowId);
      }
    }
    setTextbookQuizTrigger((prev) => (prev.nonce === 0 ? prev : { nonce: 0, mode: 'row' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Textbook Code Mission, Navigation & Completion Handlers
  const markTextbookMission = React.useCallback(
    (code: string, key: TextbookMissionKey, mode: 'set' | 'toggle' = 'set') => {
      setState((prev) => {
        const existing: TextbookCodeProgress = prev.textbookProgress?.[code] || {
          missions: { listen: false, write: false, game: false, review: false }
        };
        const currentVal = Boolean(existing.missions?.[key]);
        const nextVal = mode === 'toggle' ? !currentVal : true;
        if (nextVal === currentVal) return prev;
        const nextEntry: TextbookCodeProgress = {
          missions: {
            listen: Boolean(existing.missions?.listen),
            write: Boolean(existing.missions?.write),
            game: Boolean(existing.missions?.game),
            review: Boolean(existing.missions?.review),
            [key]: nextVal
          },
          ...(existing.completedAt ? { completedAt: existing.completedAt } : {}),
          ...(existing.lastVisitedAt ? { lastVisitedAt: existing.lastVisitedAt } : {})
        };
        return {
          ...prev,
          textbookProgress: {
            ...(prev.textbookProgress || {}),
            [code]: nextEntry
          }
        };
      });
    },
    []
  );

  const navigateToTextbookEntry = React.useCallback((entry: TextbookCodeEntry) => {
    setActiveTextbookCode(entry.code);
    const nowIso = new Date().toISOString();
    setState((prev) => {
      const existing = prev.textbookProgress?.[entry.code];
      const nextEntry: TextbookCodeProgress = {
        missions: {
          listen: Boolean(existing?.missions?.listen),
          write: Boolean(existing?.missions?.write),
          game: Boolean(existing?.missions?.game),
          review: Boolean(existing?.missions?.review)
        },
        ...(existing?.completedAt ? { completedAt: existing.completedAt } : {}),
        lastVisitedAt: nowIso
      };
      return {
        ...prev,
        textbookProgress: {
          ...(prev.textbookProgress || {}),
          [entry.code]: nextEntry
        }
      };
    });

    setActiveTab(entry.target.tab);
    if (entry.target.studySubTab) {
      setStudySubTab(entry.target.studySubTab);
    }
    if (entry.target.rowId) {
      setSelectedRowId(entry.target.rowId);
    }
    setResumeTarget({
      kanaChar: entry.target.kanaChar,
      nonce: Date.now()
    });
    if (entry.target.openStageQuiz) {
      quizTriggerCounterRef.current += 1;
      setTextbookQuizTrigger({
        nonce: quizTriggerCounterRef.current,
        mode: entry.target.quizMode || 'row'
      });
    } else {
      setTextbookQuizTrigger((prev) => (prev.nonce === 0 ? prev : { nonce: 0, mode: 'row' }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleApplyTextbookCode = React.useCallback(
    (rawInput: string): boolean => {
      const entry = findTextbookCode(rawInput);
      if (!entry) {
        notify('코드를 찾을 수 없어요. 교재 오른쪽 아래 QR 옆 코드를 확인해 보세요.', 'warning');
        return false;
      }
      const curState = stateRef.current;
      if (!curState.unlockedStages.includes(entry.requiredStageId)) {
        notify('아직 열리지 않은 단계예요. 앞 단계를 먼저 끝내요.', 'warning');
        return false;
      }
      if (adminMode) {
        setAdminMode(false);
      }
      navigateToTextbookEntry(entry);
      if (entry.fallbackNotice) {
        notify(`교재 p.${entry.pages} · ${entry.code} (${entry.title}) — ${entry.fallbackNotice}`, 'info');
      } else {
        notify(`교재 p.${entry.pages} · ${entry.code} (${entry.title}) 과로 이동했어요!`, 'success');
      }
      return true;
    },
    [adminMode, navigateToTextbookEntry, notify]
  );

  const handleCompleteTextbookCode = React.useCallback(
    (code: string) => {
      const cur = stateRef.current;
      const entry = findTextbookCode(code);
      if (!entry) return;
      if (cur.textbookProgress?.[code]?.completedAt) {
        notify('이미 완료한 단원이에요! (중복 EXP는 지급되지 않아요)', 'info');
        return;
      }

      const nowIso = new Date().toISOString();
      const expGain = cur.missionSettings?.textbookCompletionExp ?? 20;
      const wasPart1Done =
        PART1_TEXTBOOK_CODES.length > 0 &&
        PART1_TEXTBOOK_CODES.every((c) => Boolean(cur.textbookProgress?.[c]?.completedAt));

      const nextPart1Done =
        PART1_TEXTBOOK_CODES.length > 0 &&
        PART1_TEXTBOOK_CODES.every(
          (c) => c === code || Boolean(cur.textbookProgress?.[c]?.completedAt)
        );
      const part1BonusExp = !wasPart1Done && nextPart1Done ? 100 : 0;

      setState((prev) => {
        if (prev.textbookProgress?.[code]?.completedAt) return prev;
        const prevExisting = prev.textbookProgress?.[code];
        const nextEntry: TextbookCodeProgress = {
          missions: {
            listen: Boolean(prevExisting?.missions?.listen),
            write: Boolean(prevExisting?.missions?.write),
            game: Boolean(prevExisting?.missions?.game),
            review: Boolean(prevExisting?.missions?.review)
          },
          completedAt: nowIso,
          lastVisitedAt: prevExisting?.lastVisitedAt || nowIso
        };
        const next = recordStudyActivity(
          {
            ...prev,
            textbookProgress: {
              ...(prev.textbookProgress || {}),
              [code]: nextEntry
            }
          },
          {
            expGain: expGain + part1BonusExp,
            studyMinutes: 0
          }
        );
        return withSyncedMissionLog(next);
      });

      playSfx(part1BonusExp > 0 ? 'levelup' : 'correct');
      if (part1BonusExp > 0) {
        notify(
          `🎉 0단계 1권 Part 1 완주! +${expGain} EXP + 보너스 +100 EXP & '히라가나 교재 완주' 배지를 획득했어요!`,
          'success'
        );
      } else {
        notify(`교재 p.${entry.pages} · ${entry.code} (${entry.title}) 완료! (+${expGain} EXP)`, 'success');
      }
    },
    [notify, withSyncedMissionLog]
  );

  // Consume pending ?code=... URL parameter once auth, onboarding & diagnostic test finish
  React.useEffect(() => {
    if (!authReady || profileModalMode || diagnosticOpen || adminMode) return;
    let pending = '';
    try {
      pending = sessionStorage.getItem(PENDING_CODE_STORAGE_KEY) || '';
      if (pending) {
        sessionStorage.removeItem(PENDING_CODE_STORAGE_KEY);
      }
    } catch {
      return;
    }
    if (pending) {
      handleApplyTextbookCode(pending);
    }
  }, [authReady, profileModalMode, diagnosticOpen, adminMode, handleApplyTextbookCode]);

  // Auto-mark Textbook Mission #1 (listen) on Japanese audio playback
  React.useEffect(() => {
    if (!activeTextbookCode || adminMode) return;
    return subscribeSpeechPlay(() => {
      markTextbookMission(activeTextbookCode, 'listen', 'set');
    });
  }, [activeTextbookCode, adminMode, markTextbookMission]);

  // Auto-mark Textbook Mission #4 (review) when entering SRS review tab
  React.useEffect(() => {
    if (!activeTextbookCode || adminMode) return;
    if (activeTab === 'study' && studySubTab === 'srs') {
      markTextbookMission(activeTextbookCode, 'review', 'set');
    }
  }, [activeTextbookCode, activeTab, studySubTab, adminMode, markTextbookMission]);

  const handleChangeLevelScope = (level: JlptLevel, subLevel: SubDifficulty) => {
    setState((prev) => evaluateBadges({ ...prev, targetLevel: level, subLevel }));
    notify(
      `${level === 'STAGE0' ? '0단계(가나·기초)' : `JLPT ${level}`} · ${subLevel}단계 범위로 변경했어요.`,
      'info'
    );
  };

  const handleMarkKanaLearned = (char: string) => {
    setState((prev) => {
      const already = prev.learnedKana.includes(char);
      const learnedKana = already ? prev.learnedKana : [...prev.learnedKana, char];
      const nextCount = already ? prev.dailyMissions.newCharsCount : prev.dailyMissions.newCharsCount + 1;
      const hitMissionNow =
        !already &&
        prev.dailyMissions.newCharsCount < prev.missionSettings.dailyNewChars &&
        nextCount >= prev.missionSettings.dailyNewChars;

      let next = recordStudyActivity(
        {
          ...prev,
          learnedKana,
          dailyMissions: {
            ...prev.dailyMissions,
            newCharsCount: nextCount
          }
        },
        {
          expGain: already ? 5 : 15 + (hitMissionNow ? 50 : 0),
          studyMinutes: 0
        }
      );

      // Seed into SRS if missing
      if (!next.srsItems[char]) {
        next = recordKanaAttempt(next, char, true);
      }
      if (hitMissionNow) {
        notify(`오늘의 새 글자 미션 달성! +50 보너스 EXP`, 'success');
      } else if (!already) {
        notify(`「${char}」를 내 글자 노트에 저장했어요! (+15 EXP)`, 'success');
      }
      return withSyncedMissionLog(next);
    });
  };

  const handleToggleBookmark = (char: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedKana.includes(char);
      const bookmarkedKana = exists
        ? prev.bookmarkedKana.filter((c) => c !== char)
        : [...prev.bookmarkedKana, char];
      notify(exists ? `「${char}」 북마크를 해제했어요.` : `「${char}」를 헷갈리는 글자로 표시했어요.`, 'info');
      return { ...prev, bookmarkedKana };
    });
  };

  const handleRecordAttempt = React.useCallback(
    (char: string, isCorrect: boolean, confusedChar?: string, isGameContext = false) => {
      setState((prev) => {
        let next = recordKanaAttempt(prev, char, isCorrect, confusedChar);
        next = recordStudyActivity(next, {
          expGain: isCorrect ? 10 : 2,
          isGameExp: Boolean(isGameContext),
          quizAttempts: 1,
          quizCorrect: isCorrect ? 1 : 0
        });
        return evaluateBadges(next);
      });
    },
    []
  );

  const handleCompleteStageQuiz = (
    stageId: string,
    scorePercent: number,
    _correctCount: number,
    _totalCount: number
  ) => {
    setState((prev) => {
      let next = recordStudyActivity(prev, {
        expGain: scorePercent >= 80 ? 80 : 20,
        studyMinutes: 0
      });

      if (scorePercent >= 80) {
        const completed = new Set(next.completedStages);
        completed.add(stageId);

        const unlocked = new Set(next.unlockedStages);
        const idx = ADVENTURE_STAGES.findIndex((s) => s.id === stageId);
        const currentStage = ADVENTURE_STAGES[idx];
        const nextStage = idx >= 0 && idx + 1 < ADVENTURE_STAGES.length ? ADVENTURE_STAGES[idx + 1] : null;
        if (nextStage) {
          unlocked.add(nextStage.id);
        }

        const cards = new Set(next.cultureCards);
        let wonCardTitle = '';
        if (currentStage?.rewardCardId) {
          cards.add(currentStage.rewardCardId);
          wonCardTitle = CULTURE_CARDS.find((c) => c.id === currentStage.rewardCardId)?.title || '';
        }

        next = {
          ...next,
          completedStages: Array.from(completed),
          unlockedStages: Array.from(unlocked),
          cultureCards: Array.from(cards),
          currentStageId: nextStage ? nextStage.id : next.currentStageId
        };
        playSfx('levelup');
        notify(
          `🎉 ${scorePercent}점으로 단계 통과! ${nextStage ? `「${nextStage.title}」이(가) 열리고 ` : ''}${wonCardTitle ? `문화 카드 「${wonCardTitle}」을 얻었어요!` : ''}`,
          'success'
        );
      } else {
        notify(`${scorePercent}점! 80점 이상이면 다음 모험이 열려요. 조금만 더 연습해 봐요!`, 'warning');
      }

      return withSyncedMissionLog(next);
    });
  };

  const handleCompleteSrsSession = (reviewedCount: number) => {
    setState((prev) => {
      const wasDone = prev.dailyMissions.reviewDone;
      const next = recordStudyActivity(
        {
          ...prev,
          dailyMissions: {
            ...prev.dailyMissions,
            reviewDone: true
          }
        },
        {
          expGain: wasDone ? 15 : 40,
          studyMinutes: 0
        }
      );
      notify(`망각 곡선 복습 ${reviewedCount}개 완료! ${wasDone ? '+15 EXP' : '오늘의 복습 미션 +40 EXP'}`, 'success');
      return withSyncedMissionLog(next);
    });
  };

  const handleCompleteSpeakingMission = () => {
    setState((prev) => {
      const wasDone = prev.dailyMissions.reviewDone;
      const next = recordStudyActivity(
        {
          ...prev,
          dailyMissions: {
            ...prev.dailyMissions,
            reviewDone: true
          }
        },
        {
          expGain: wasDone ? 10 : 40,
          studyMinutes: 0
        }
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleFinishKanaDrop = (
    difficulty: KanaDropDifficulty,
    score: number,
    correctCount: number,
    _durationMinutes: number
  ) => {
    const diffLabelMap: Record<KanaDropDifficulty, string> = {
      easy: '쉬움',
      normal: '보통',
      hard: '어려움'
    };
    setState((prev) => {
      const nextGamesPlayed = prev.dailyMissions.gamesPlayed + 1;
      const hitMission =
        prev.dailyMissions.gamesPlayed < prev.missionSettings.dailyGameMissions &&
        nextGamesPlayed >= prev.missionSettings.dailyGameMissions;
      const requestedExp = Math.max(15, Math.round(score / 40)) + (hitMission ? 30 : 0);

      let updatedTextbookProgress = prev.textbookProgress;
      if (activeTextbookCode) {
        const existing = prev.textbookProgress?.[activeTextbookCode];
        updatedTextbookProgress = {
          ...(prev.textbookProgress || {}),
          [activeTextbookCode]: {
            missions: {
              listen: Boolean(existing?.missions?.listen),
              write: Boolean(existing?.missions?.write),
              game: true,
              review: Boolean(existing?.missions?.review)
            },
            ...(existing?.completedAt ? { completedAt: existing.completedAt } : {}),
            ...(existing?.lastVisitedAt ? { lastVisitedAt: existing.lastVisitedAt } : {})
          }
        };
      }

      const next = recordStudyActivity(
        {
          ...prev,
          textbookProgress: updatedTextbookProgress,
          gameRecords: {
            ...prev.gameRecords,
            kanaDropBest: Math.max(prev.gameRecords.kanaDropBest, score),
            kanaDropBestByDifficulty: {
              ...prev.gameRecords.kanaDropBestByDifficulty,
              [difficulty]: Math.max(
                prev.gameRecords.kanaDropBestByDifficulty?.[difficulty] || 0,
                score
              )
            },
            kanaDropPlaysToday: prev.gameRecords.kanaDropPlaysToday + 1
          },
          dailyMissions: {
            ...prev.dailyMissions,
            gamesPlayed: nextGamesPlayed
          }
        },
        {
          expGain: requestedExp,
          isGameExp: true,
          gameMinutes: 0
        }
      );

      const gained = Math.max(0, next.exp - prev.exp);
      notify(
        gained > 0
          ? hitMission
            ? `가나 낙하(${diffLabelMap[difficulty]}) ${score.toLocaleString()}점 (${correctCount}개 정답)! 게임 미션 달성 +${gained} EXP!`
            : `가나 낙하(${diffLabelMap[difficulty]}) ${score.toLocaleString()}점 (${correctCount}개 정답) +${gained} EXP 저장 완료!`
          : `가나 낙하(${diffLabelMap[difficulty]}) ${score.toLocaleString()}점 저장! (오늘 게임 EXP 상한 도달)`,
        gained > 0 ? 'success' : 'info'
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleFinishListeningGame = (score: number, _durationMinutes: number) => {
    setState((prev) => {
      const nextGamesPlayed = prev.dailyMissions.gamesPlayed + 1;
      const hitMission =
        prev.dailyMissions.gamesPlayed < prev.missionSettings.dailyGameMissions &&
        nextGamesPlayed >= prev.missionSettings.dailyGameMissions;

      const next = recordStudyActivity(
        {
          ...prev,
          gameRecords: {
            ...prev.gameRecords,
            listeningBest: Math.max(prev.gameRecords.listeningBest, score),
            listeningPlaysToday: prev.gameRecords.listeningPlaysToday + 1
          },
          dailyMissions: {
            ...prev.dailyMissions,
            gamesPlayed: nextGamesPlayed
          }
        },
        {
          expGain: Math.max(15, Math.round(score / 30)) + (hitMission ? 30 : 0),
          isGameExp: true,
          gameMinutes: 0
        }
      );
      const gained = Math.max(0, next.exp - prev.exp);
      notify(
        gained > 0
          ? `듣고 글자 고르기 ${score}점 (+${gained} EXP) 저장 완료!`
          : `듣고 글자 고르기 ${score}점 저장 완료! (오늘 게임 EXP 상한 도달)`,
        gained > 0 ? 'success' : 'info'
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleFinishPairMatch = (score: number, _durationMinutes: number) => {
    setState((prev) => {
      const nextGamesPlayed = prev.dailyMissions.gamesPlayed + 1;
      const hitMission =
        prev.dailyMissions.gamesPlayed < prev.missionSettings.dailyGameMissions &&
        nextGamesPlayed >= prev.missionSettings.dailyGameMissions;
      const expGain = Math.max(20, Math.round(score / 30)) + (hitMission ? 30 : 0);

      const next = recordStudyActivity(
        {
          ...prev,
          gameRecords: {
            ...prev.gameRecords,
            pairMatchBest: Math.max(prev.gameRecords.pairMatchBest || 0, score),
            pairMatchPlaysToday: (prev.gameRecords.pairMatchPlaysToday || 0) + 1
          },
          dailyMissions: {
            ...prev.dailyMissions,
            gamesPlayed: nextGamesPlayed
          }
        },
        {
          expGain,
          isGameExp: true,
          gameMinutes: 0
        }
      );
      const gained = Math.max(0, next.exp - prev.exp);
      notify(
        gained > 0
          ? `카드 짝맞추기 ${score.toLocaleString()}점 달성! (+${gained} EXP)`
          : `카드 짝맞추기 ${score.toLocaleString()}점 달성! (오늘 게임 EXP 상한 도달)`,
        gained > 0 ? 'success' : 'info'
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleToggleVocabLearned = (vocabId: string) => {
    setState((prev) => {
      const exists = prev.learnedVocab.includes(vocabId);
      const learnedVocab = exists
        ? prev.learnedVocab.filter((id) => id !== vocabId)
        : [...prev.learnedVocab, vocabId];
      if (exists) {
        return { ...prev, learnedVocab };
      }
      const next = recordStudyActivity(
        { ...prev, learnedVocab },
        { expGain: 15, studyMinutes: 0 }
      );
      notify('단어를 외움 목록에 저장했어요! (+15 EXP)', 'success');
      return withSyncedMissionLog(next);
    });
  };

  const handleToggleVocabBookmark = (vocabId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedVocab.includes(vocabId);
      const bookmarkedVocab = exists
        ? prev.bookmarkedVocab.filter((id) => id !== vocabId)
        : [...prev.bookmarkedVocab, vocabId];
      notify(exists ? '단어 북마크를 해제했어요.' : '헷갈리는 단어로 북마크했어요!', 'info');
      return { ...prev, bookmarkedVocab };
    });
  };

  const handleToggleKanjiLearned = (kanjiId: string) => {
    setState((prev) => {
      const exists = prev.learnedKanji.includes(kanjiId);
      const learnedKanji = exists
        ? prev.learnedKanji.filter((id) => id !== kanjiId)
        : [...prev.learnedKanji, kanjiId];
      if (exists) {
        return { ...prev, learnedKanji };
      }
      const next = recordStudyActivity(
        { ...prev, learnedKanji },
        { expGain: 20, studyMinutes: 0 }
      );
      notify('한자 마스터 기록에 추가했어요! (+20 EXP)', 'success');
      return withSyncedMissionLog(next);
    });
  };

  const handleToggleKanjiBookmark = (kanjiId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedKanji.includes(kanjiId);
      const bookmarkedKanji = exists
        ? prev.bookmarkedKanji.filter((id) => id !== kanjiId)
        : [...prev.bookmarkedKanji, kanjiId];
      notify(exists ? '한자 북마크를 해제했어요.' : '한자 노트에 북마크했어요!', 'info');
      return { ...prev, bookmarkedKanji };
    });
  };

  const handleToggleGrammarLearned = (grammarId: string) => {
    setState((prev) => {
      const exists = prev.learnedGrammar.includes(grammarId);
      const learnedGrammar = exists
        ? prev.learnedGrammar.filter((id) => id !== grammarId)
        : [...prev.learnedGrammar, grammarId];
      if (exists) {
        return { ...prev, learnedGrammar };
      }
      const next = recordStudyActivity(
        { ...prev, learnedGrammar },
        { expGain: 20, studyMinutes: 0 }
      );
      notify('문법 패턴 학습을 완료했어요! (+20 EXP)', 'success');
      return withSyncedMissionLog(next);
    });
  };

  const handleGrantStudyExp = (expGain: number, reason: string, _studyMinutes = 0) => {
    setState((prev) => {
      const next = recordStudyActivity(prev, { expGain, studyMinutes: 0 });
      notify(`${reason} (+${expGain} EXP)`, 'success');
      return withSyncedMissionLog(next);
    });
  };

  const handleRecordWrongNote = React.useCallback(
    (entry: Omit<WrongNoteEntry, 'id' | 'createdAt'>): string => {
      const entryId = `wn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setState((prev) => {
        const newEntry: WrongNoteEntry = {
          ...entry,
          id: entryId,
          createdAt: new Date().toISOString()
        };
        const filtered = prev.wrongNoteEntries.filter(
          (item) => !(item.sourceType === entry.sourceType && item.prompt === entry.prompt)
        );
        return {
          ...prev,
          wrongNoteEntries: [newEntry, ...filtered].slice(0, 120)
        };
      });
      return entryId;
    },
    []
  );

  const handleTagWrongNote = React.useCallback((entryId: string, reasonTag: WrongReasonTag) => {
    setState((prev) => ({
      ...prev,
      wrongNoteEntries: prev.wrongNoteEntries.map((w) =>
        w.id === entryId ? { ...w, reasonTag } : w
      )
    }));
  }, []);

  const handleResolveWrongNote = (entryId: string) => {
    setState((prev) => ({
      ...prev,
      wrongNoteEntries: prev.wrongNoteEntries.filter((w) => w.id !== entryId)
    }));
    notify('오답노트에서 복습 완료로 정리했어요!', 'info');
  };

  const handleSubmitMockExam = (
    attempt: MockExamAttempt,
    wrongNotes: (Omit<WrongNoteEntry, 'id' | 'createdAt'> & { id?: string })[]
  ) => {
    setState((prev) => {
      const nowIso = new Date().toISOString();
      const newNotes: WrongNoteEntry[] = wrongNotes.map((w, idx) => ({
        ...w,
        id: w.id || `wn_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`,
        createdAt: nowIso
      }));
      const mergedNotes = [
        ...newNotes,
        ...prev.wrongNoteEntries.filter(
          (oldItem) =>
            !newNotes.some(
              (n) => n.sourceType === oldItem.sourceType && n.prompt === oldItem.prompt
            )
        )
      ].slice(0, 120);

      const totalQ = attempt.sections.reduce((acc, s) => acc + s.total, 0);
      const correctQ = attempt.sections.reduce((acc, s) => acc + s.correct, 0);

      const stageForLevel =
        attempt.level !== 'STAGE0'
          ? ADVENTURE_STAGES.find((s) => s.world === attempt.level)
          : undefined;
      const completed = new Set(prev.completedStages);
      const unlocked = new Set(prev.unlockedStages);
      const cards = new Set(prev.cultureCards);

      if (attempt.passed && stageForLevel) {
        completed.add(stageForLevel.id);
        unlocked.add(stageForLevel.id);
        if (stageForLevel.rewardCardId) cards.add(stageForLevel.rewardCardId);
        const idx = ADVENTURE_STAGES.findIndex((s) => s.id === stageForLevel.id);
        const nextStage = idx >= 0 && idx + 1 < ADVENTURE_STAGES.length ? ADVENTURE_STAGES[idx + 1] : null;
        if (nextStage) unlocked.add(nextStage.id);
      }

      const expGain = attempt.passed ? 120 : 50;
      const coinGain = attempt.passed ? 80 : 30;
      const next = recordStudyActivity(
        {
          ...prev,
          mockExamHistory: [attempt, ...prev.mockExamHistory].slice(0, 50),
          wrongNoteEntries: mergedNotes,
          completedStages: Array.from(completed),
          unlockedStages: Array.from(unlocked),
          cultureCards: Array.from(cards)
        },
        {
          expGain,
          coinGain,
          studyMinutes: 0,
          quizAttempts: totalQ,
          quizCorrect: correctQ
        }
      );

      if (attempt.passed) {
        playSfx('levelup');
        notify(
          `🎉 ${attempt.level} 모의고사 합격 (${attempt.totalScore}/${attempt.maxScore}점)! +${expGain} EXP · +${coinGain} 코인`,
          'success'
        );
      } else {
        notify(
          `${attempt.level} 모의고사 채점 완료 (${attempt.totalScore}점). 오답노트 ${wrongNotes.length}개를 저장했어요! (+${expGain} EXP)`,
          'warning'
        );
      }

      return withSyncedMissionLog(next);
    });
  };

  const handleTogglePlanTask = (taskKey: string) => {
    setState((prev) => {
      const exists = prev.fourWeekPlanChecks.includes(taskKey);
      const fourWeekPlanChecks = exists
        ? prev.fourWeekPlanChecks.filter((k) => k !== taskKey)
        : [...prev.fourWeekPlanChecks, taskKey];
      if (exists) {
        return { ...prev, fourWeekPlanChecks };
      }
      const next = recordStudyActivity(
        { ...prev, fourWeekPlanChecks },
        { expGain: 15, studyMinutes: 0 }
      );
      notify('4주 집중 플랜 과제 체크 완료! (+15 EXP)', 'success');
      return withSyncedMissionLog(next);
    });
  };

  const handleBuyShopItem = (item: ShopItem) => {
    setState((prev) => {
      if (prev.coins < item.priceCoins) {
        notify('코인이 부족해요. 학습과 게임 미션을 완료해 코인을 모아 보세요!', 'warning');
        return prev;
      }
      const purchase = {
        id: `buy_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        itemId: item.id,
        title: item.title,
        emoji: item.emoji,
        priceCoins: item.priceCoins,
        effectType: item.effectType,
        status: item.effectType === 'streak_protection' ? ('redeemed' as const) : ('unused' as const),
        purchasedAt: new Date().toISOString(),
        ...(item.effectType === 'streak_protection' ? { redeemedAt: new Date().toISOString() } : {})
      };
      playSfx('levelup');
      notify(`${item.emoji} 「${item.title}」 교환 완료!`, 'success');
      return {
        ...prev,
        coins: Math.max(0, prev.coins - item.priceCoins),
        streakProtections:
          item.effectType === 'streak_protection'
            ? prev.streakProtections + 1
            : prev.streakProtections,
        purchasedItems: [purchase, ...prev.purchasedItems].slice(0, 80)
      };
    });
  };

  const handleRedeemPurchasedItem = (purchasedId: string) => {
    setState((prev) => ({
      ...prev,
      purchasedItems: prev.purchasedItems.map((p) =>
        p.id === purchasedId ? { ...p, status: 'redeemed', redeemedAt: new Date().toISOString() } : p
      )
    }));
    notify('보상 쿠폰 사용을 완료 처리했어요!', 'success');
  };

  const handleGrantCoins = (coinDelta: number) => {
    setState((prev) => ({
      ...prev,
      coins: Math.max(0, (prev.coins || 0) + coinDelta)
    }));
    notify(
      coinDelta >= 0 ? `학생에게 +${coinDelta} 코인을 지급했어요!` : `${Math.abs(coinDelta)} 코인을 차감했어요.`,
      'success'
    );
  };

  const handleToggleRoutine = (routine: 'routineVocab' | 'routineGrammar' | 'routineReading') => {
    setState((prev) => {
      const nextVal = !prev.dailyMissions[routine];
      const next = recordStudyActivity(
        {
          ...prev,
          dailyMissions: {
            ...prev.dailyMissions,
            [routine]: nextVal
          }
        },
        { expGain: nextVal ? 10 : 0 }
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleAcknowledgePraise = (praiseId: string, bonusExp: number) => {
    setState((prev) => {
      if (prev.acknowledgedPraiseIds.includes(praiseId)) return prev;
      playSfx('levelup');
      const next = recordStudyActivity(
        {
          ...prev,
          acknowledgedPraiseIds: [...prev.acknowledgedPraiseIds, praiseId]
        },
        { expGain: bonusExp }
      );
      notify(bonusExp > 0 ? `응원 보너스 +${bonusExp} EXP를 받았어요!` : '응원 메시지를 확인했어요!', 'success');
      return next;
    });
  };

  // JSON Export & Import
  const handleExportJson = React.useCallback(() => {
    const nowIso = new Date().toISOString();
    const updatedState = { ...state, lastBackupAt: nowIso };
    setState(updatedState);
    const json = exportBackupJson(updatedState);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ari-jlpt-backup-${getTodayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify('JSON 백업 파일이 다운로드되었어요!', 'success');
  }, [state, notify]);

  // 7-day Backup Reminder Toast on Home / Admin entry when overdue
  React.useEffect(() => {
    if (backupToastShownRef.current) return;
    if (profileModalMode || diagnosticOpen) return;
    if (activeTab !== 'home' && !adminMode) return;
    const hasProgress =
      state.exp > 0 ||
      state.learnedKana.length > 0 ||
      state.learnedVocab.length > 0 ||
      state.mockExamHistory.length > 0;
    if (!hasProgress) return;
    const today = getTodayKey();
    const overdueDays = state.lastBackupAt
      ? diffDaysBetweenKeys(state.lastBackupAt.slice(0, 10), today)
      : diffDaysBetweenKeys(state.startDate || today, today);
    if (overdueDays >= 7) {
      backupToastShownRef.current = true;
      notify(
        state.lastBackupAt
          ? `마지막 백업 후 ${overdueDays}일이 지났어요. 기록을 안전하게 JSON으로 백업해 둘까요?`
          : '학습 기록이 7일 넘게 백업되지 않았어요. JSON 백업 파일을 저장해 두세요!',
        'warning',
        {
          actionLabel: '지금 JSON 백업',
          onAction: handleExportJson
        }
      );
    }
  }, [
    activeTab,
    adminMode,
    profileModalMode,
    diagnosticOpen,
    state.lastBackupAt,
    state.startDate,
    state.exp,
    state.learnedKana.length,
    state.learnedVocab.length,
    state.mockExamHistory.length,
    notify,
    handleExportJson
  ]);

  const handleImportJson = (raw: string) => {
    const parsed = parseBackupJson(raw);
    if (!parsed) {
      notify('올바른 백업 JSON 파일이 아니에요. 파일을 확인해 주세요.', 'error');
      return;
    }
    setState(parsed);
    if (parsed.profileConfigured) {
      setProfileModalMode(null);
    }
    notify(`${parsed.studentName}의 백업 기록을 복원했어요!`, 'success');
  };

  const handleUpdateProfile = (
    studentName: string,
    profileEmoji: string,
    fontSizeScale?: FontSizeScale
  ) => {
    const cleanName = studentName.trim().slice(0, 40) || DEFAULT_STUDENT_NAME;
    const cleanEmoji = profileEmoji.trim().slice(0, 16) || DEFAULT_PROFILE_EMOJI;
    setState((prev) => ({
      ...prev,
      studentName: cleanName,
      profileEmoji: cleanEmoji,
      fontSizeScale: fontSizeScale || prev.fontSizeScale || 'normal',
      profileConfigured: true
    }));
    setStudentsList((prev) =>
      prev.map((s) =>
        s.uid === state.uid
          ? {
              ...s,
              studentName: cleanName,
              profileEmoji: cleanEmoji,
              fontSizeScale: fontSizeScale || s.fontSizeScale || 'normal',
              profileConfigured: true
            }
          : s
      )
    );
    setProfileModalMode(null);
    notify(`${cleanEmoji} 프로필을 "${cleanName}"(으)로 저장했어요!`, 'success');
  };

  const handleChangeFontSizeScale = (fontSizeScale: FontSizeScale) => {
    const labels: Record<FontSizeScale, string> = {
      normal: '보통',
      large: '크게',
      xlarge: '아주 크게'
    };
    setState((prev) => ({ ...prev, fontSizeScale }));
    notify(`글자 크기를 「${labels[fontSizeScale]}」로 변경했어요!`, 'info');
  };

  const handleUpdateLastLocation = React.useCallback((loc: LastStudyLocation) => {
    setState((prev) => {
      const cur = prev.lastStudyLocation;
      if (
        cur &&
        cur.tab === loc.tab &&
        cur.studySubTab === loc.studySubTab &&
        cur.practiceSubTab === loc.practiceSubTab &&
        cur.rowId === loc.rowId &&
        cur.kanaChar === loc.kanaChar &&
        cur.vocabId === loc.vocabId &&
        cur.kanjiId === loc.kanjiId &&
        cur.grammarId === loc.grammarId &&
        cur.readingId === loc.readingId &&
        cur.listeningId === loc.listeningId &&
        cur.label === loc.label
      ) {
        return prev;
      }
      return { ...prev, lastStudyLocation: loc };
    });
  }, []);

  const handleResumeLastLocation = () => {
    const loc = state.lastStudyLocation;
    if (!loc) {
      handleNavigateTab('study', { studySubTab: 'kana' });
      return;
    }
    if (loc.tab === 'study') {
      setActiveTab('study');
      if (loc.studySubTab) setStudySubTab(loc.studySubTab);
      if (loc.rowId) setSelectedRowId(loc.rowId);
      setResumeTarget({
        kanaChar: loc.kanaChar,
        vocabId: loc.vocabId,
        kanjiId: loc.kanjiId,
        grammarId: loc.grammarId,
        nonce: Date.now()
      });
    } else if (loc.tab === 'practice') {
      setActiveTab('practice');
      if (loc.practiceSubTab) setPracticeSubTab(loc.practiceSubTab);
      setResumeTarget({
        readingId: loc.readingId,
        listeningId: loc.listeningId,
        nonce: Date.now()
      });
    }
    setTextbookQuizTrigger((prev) => (prev.nonce === 0 ? prev : { nonce: 0, mode: 'row' }));
    notify(`「${loc.label}」으로 바로 이동했어요!`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteDiagnostic = (evalResult: DiagnosticEvaluation) => {
    setForceDiagnosticOpen(false);
    setState((prev) => {
      const unlocked = Array.from(new Set([...prev.unlockedStages, ...evalResult.unlockedStages]));
      const next = recordStudyActivity(
        {
          ...prev,
          diagnosticCompleted: true,
          diagnosticResult: {
            score: evalResult.score,
            total: evalResult.total,
            recommendedLevel: evalResult.recommendedLevel,
            recommendedSubLevel: evalResult.recommendedSubLevel,
            recommendedStageId: evalResult.recommendedStageId,
            accepted: true,
            skipped: false,
            completedAt: new Date().toISOString()
          },
          targetLevel: evalResult.recommendedLevel,
          subLevel: evalResult.recommendedSubLevel,
          currentStageId: evalResult.recommendedStageId,
          unlockedStages: unlocked
        },
        { expGain: 30, studyMinutes: 0 }
      );
      return withSyncedMissionLog(next);
    });
    playSfx('levelup');
    notify(
      `${evalResult.recommendedLevel === 'STAGE0' ? '0단계' : `JLPT ${evalResult.recommendedLevel}`} 추천 위치로 출발선을 맞췄어요! (+30 EXP)`,
      'success'
    );
  };

  const handleSkipDiagnostic = () => {
    setForceDiagnosticOpen(false);
    setState((prev) => ({
      ...prev,
      diagnosticCompleted: true,
      diagnosticResult: {
        score: 0,
        total: 12,
        recommendedLevel: 'STAGE0',
        recommendedSubLevel: 1,
        recommendedStageId: 'stage_h_a',
        accepted: false,
        skipped: true,
        completedAt: new Date().toISOString()
      }
    }));
    notify('0단계 히라가나 あ행부터 차근차근 시작해 봐요!', 'info');
  };

  // Admin Handlers
  const handleSelectAdminStudent = async (uid: string) => {
    setAdminSelectedUid(uid);
    const found = studentsList.find((s) => s.uid === uid);
    if (found) {
      setState(found);
    } else {
      const loaded = await loadStudentFromCloud(uid);
      if (loaded) setState(loaded);
    }
  };

  const handleAdminSendPraise = (text: string, bonusExp: number) => {
    const newMsg = {
      id: `praise_${Date.now()}`,
      text,
      bonusExp,
      createdAt: new Date().toISOString(),
      senderName: firebaseUser?.displayName?.split(' ')[0] || '선생님'
    };
    setState((prev) => ({
      ...prev,
      praiseMessages: [...prev.praiseMessages.slice(-20), newMsg]
    }));
    notify(`${state.studentName} 홈에 칭찬 메시지와 보너스 EXP 선물을 보냈어요!`, 'success');
  };

  const handleChangeAdminPin = async (newPin: string) => {
    setAdminPin(newPin);
    setLocalAdminPin(newPin);
    if (firebaseUser && isGoogleAdmin) {
      try {
        await saveAdminPinToCloud(firebaseUser.uid, newPin);
      } catch {
        // local pin still saved
      }
    }
    notify('관리자 4자리 PIN 번호가 변경되었어요.', 'success');
  };

  const handleAddAdminUid = async (uid: string, email: string, name: string) => {
    if (!firebaseUser || !isGoogleAdmin) {
      notify('관리자 Google 로그인 상태에서 추가할 수 있어요.', 'warning');
      return;
    }
    try {
      await addAdminByUid(uid, email, name);
      notify(`${email} 관리자 권한을 Firestore에 등록했어요!`, 'success');
    } catch {
      notify('관리자 등록 중 오류가 발생했어요. UID 형식을 확인해 주세요.', 'error');
    }
  };

  const todayKey = getTodayKey();
  const activeMinutesToday =
    (state.studyLogs[todayKey]?.studyMinutes || 0) + (state.studyLogs[todayKey]?.gameMinutes || 0);
  const activeTextbookEntry = activeTextbookCode ? findTextbookCode(activeTextbookCode) : null;
  const isOnActiveTextbookScreen = Boolean(
    activeTextbookEntry &&
      activeTab === activeTextbookEntry.target.tab &&
      (!activeTextbookEntry.target.studySubTab ||
        studySubTab === activeTextbookEntry.target.studySubTab) &&
      (!activeTextbookEntry.target.rowId || selectedRowId === activeTextbookEntry.target.rowId)
  );

  return (
    <div className="min-h-screen bg-[#FFF7EC] text-[#2B2340]">
      {adminMode ? (
        <AdminDashboardView
          state={state}
          studentsList={studentsList}
          selectedStudentUid={adminSelectedUid || state.uid}
          onSelectStudent={handleSelectAdminStudent}
          adminSubTab={adminSubTab}
          onChangeSubTab={setAdminSubTab}
          onExitAdmin={() => setAdminMode(false)}
          onUpdateProfile={handleUpdateProfile}
          onUpdateMissionSettings={(patch) => {
            setState((prev) => ({
              ...prev,
              missionSettings: { ...prev.missionSettings, ...patch }
            }));
          }}
          onUpdateLevelAssignment={(level, subLevel) => {
            setState((prev) => ({ ...prev, targetLevel: level, subLevel }));
            notify('학생 목표 급수·난이도를 저장했어요.', 'success');
          }}
          onChangeFontSizeScale={handleChangeFontSizeScale}
          onRetakeDiagnostic={() => {
            setAdminMode(false);
            setForceDiagnosticOpen(true);
          }}
          onSendPraise={handleAdminSendPraise}
          onUpdateShopCatalog={(shopCatalog) => {
            setState((prev) => ({ ...prev, shopCatalog }));
            notify('상점 상품 목록을 저장했어요.', 'success');
          }}
          onRedeemPurchasedItem={handleRedeemPurchasedItem}
          onGrantCoins={handleGrantCoins}
          onOpenRecommendedPrint={(subTab, pairId) => {
            setAdminMode(false);
            setActiveTab('print');
            setPrintSubTab(subTab);
            if (pairId) setPrintPairId(pairId);
          }}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onChangePin={handleChangeAdminPin}
          onAddAdminUid={handleAddAdminUid}
          onLoadSampleData={() => {
            const sample = createSamplePopulatedState(
              state.uid,
              state.studentName,
              state.profileEmoji || DEFAULT_PROFILE_EMOJI
            );
            setState(sample);
            notify('15일 학습 샘플 데이터를 불러왔어요! 대시보드 차트와 히트맵을 확인해 보세요.', 'success');
          }}
          onResetStudentData={() => {
            const fresh = normalizeDailyState(
              createInitialStudentState(
                state.uid,
                state.studentName,
                state.profileEmoji || DEFAULT_PROFILE_EMOJI,
                true
              )
            );
            setState(fresh);
            notify('0단계 초기 상태로 되돌렸어요.', 'info');
          }}
        />
      ) : (
        <>
          {inAppInfo.isInApp && !inAppBannerDismissed && (
            <InAppBrowserBanner
              info={inAppInfo}
              onOpenModal={() => setInAppModalOpen(true)}
            />
          )}

          <StudentHeader
            activeTab={activeTab}
            onSelectTab={(tab) => handleNavigateTab(tab)}
            studentName={state.studentName}
            profileEmoji={state.profileEmoji || DEFAULT_PROFILE_EMOJI}
            level={state.level}
            coins={state.coins}
            firebaseUser={firebaseUser}
            cloudSyncStatus={cloudSyncStatus}
            isOnline={isOnline}
            hasPendingSync={hasPendingSync}
            timerStatus={studyTimer.timerStatus}
            activeMinutesToday={activeMinutesToday}
            onGoogleLogin={handleGoogleLogin}
            onGoogleLogout={handleGoogleLogout}
            onOpenProfileModal={() => setProfileModalMode('edit')}
            onOpenAdminGate={() => setAdminGateOpen(true)}
            onApplyTextbookCode={handleApplyTextbookCode}
          />

          {activeTextbookEntry && (
            <TextbookGuideBanner
              entry={activeTextbookEntry}
              progress={state.textbookProgress?.[activeTextbookEntry.code]}
              completionExp={state.missionSettings?.textbookCompletionExp ?? 20}
              isOnTargetScreen={isOnActiveTextbookScreen}
              onToggleMission={(key) => markTextbookMission(activeTextbookEntry.code, key, 'toggle')}
              onCompleteUnit={() => handleCompleteTextbookCode(activeTextbookEntry.code)}
              onJumpToUnit={() => navigateToTextbookEntry(activeTextbookEntry)}
              onJumpToGame={() => handleNavigateTab('game')}
              onJumpToSrs={() => handleNavigateTab('study', { studySubTab: 'srs' })}
              onClose={() => setActiveTextbookCode(null)}
            />
          )}

          <main className="pb-12">
            {activeTab === 'home' && (
              <HomeView
                state={state}
                onNavigateTab={handleNavigateTab}
                onSelectStage={handleSelectStage}
                onChangeLevelScope={handleChangeLevelScope}
                onToggleRoutine={handleToggleRoutine}
                onAcknowledgePraise={handleAcknowledgePraise}
                onTogglePlanTask={handleTogglePlanTask}
                onResumeLastLocation={handleResumeLastLocation}
                onApplyTextbookCode={handleApplyTextbookCode}
                onNotify={notify}
              />
            )}

            {activeTab === 'study' && (
              <LearningLabView
                state={state}
                subTab={studySubTab}
                selectedRowId={selectedRowId}
                initialKanaChar={resumeTarget.kanaChar}
                initialVocabId={resumeTarget.vocabId}
                initialKanjiId={resumeTarget.kanjiId}
                initialGrammarId={resumeTarget.grammarId}
                openQuizNonce={textbookQuizTrigger.nonce}
                openQuizMode={textbookQuizTrigger.mode}
                onChangeSubTab={setStudySubTab}
                onSelectRow={setSelectedRowId}
                onMarkKanaLearned={handleMarkKanaLearned}
                onToggleBookmark={handleToggleBookmark}
                onRecordAttempt={handleRecordAttempt}
                onCompleteStageQuiz={handleCompleteStageQuiz}
                onCompleteSrsSession={handleCompleteSrsSession}
                onCompleteSpeakingMission={handleCompleteSpeakingMission}
                onTextbookWritingComplete={() => {
                  if (activeTextbookCode && !adminMode) {
                    markTextbookMission(activeTextbookCode, 'write', 'set');
                  }
                }}
                onOpenPrintForPair={(pairId, tab) => {
                  setPrintPairId(pairId);
                  setPrintSubTab(tab);
                  setActiveTab('print');
                }}
                onChangeLevelScope={handleChangeLevelScope}
                onToggleVocabLearned={handleToggleVocabLearned}
                onToggleVocabBookmark={handleToggleVocabBookmark}
                onToggleKanjiLearned={handleToggleKanjiLearned}
                onToggleKanjiBookmark={handleToggleKanjiBookmark}
                onToggleGrammarLearned={handleToggleGrammarLearned}
                onRecordWrongNote={handleRecordWrongNote}
                onTagWrongNote={handleTagWrongNote}
                onUpdateLastLocation={handleUpdateLastLocation}
                onGrantStudyExp={handleGrantStudyExp}
                onNotify={notify}
              />
            )}

            {activeTab === 'game' && (
              <GameZoneView
                state={state}
                onFinishKanaDrop={handleFinishKanaDrop}
                onFinishListeningGame={handleFinishListeningGame}
                onFinishPairMatch={handleFinishPairMatch}
                onRecordAttempt={handleRecordAttempt}
                onRecordWrongNote={handleRecordWrongNote}
                onTagWrongNote={handleTagWrongNote}
                onNavigateToStudy={(subTab) =>
                  handleNavigateTab('study', { studySubTab: subTab || 'kana' })
                }
                onNotify={notify}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeView
                state={state}
                subTab={practiceSubTab}
                initialReadingId={resumeTarget.readingId}
                initialListeningId={resumeTarget.listeningId}
                onChangeSubTab={setPracticeSubTab}
                onChangeLevelScope={handleChangeLevelScope}
                onSubmitMockExam={handleSubmitMockExam}
                onRecordWrongNote={handleRecordWrongNote}
                onTagWrongNote={handleTagWrongNote}
                onResolveWrongNote={handleResolveWrongNote}
                onGrantPracticeExp={(expGain, reason, studyMinutes) =>
                  handleGrantStudyExp(expGain, reason, studyMinutes)
                }
                onUpdateLastLocation={handleUpdateLastLocation}
                onOpenPrintWrongNotes={() =>
                  handleNavigateTab('print', { printSubTab: 'wrongNotes' })
                }
                onOpenPrintOmr={() => handleNavigateTab('print', { printSubTab: 'omrSheet' })}
              />
            )}

            {activeTab === 'print' && (
              <PrintCenterView
                state={state}
                subTab={printSubTab}
                selectedRowId={selectedRowId}
                selectedPairId={printPairId}
                onChangeSubTab={setPrintSubTab}
                onChangeRow={setSelectedRowId}
                onChangePair={setPrintPairId}
              />
            )}

            {activeTab === 'shop' && (
              <ShopView state={state} onBuyShopItem={handleBuyShopItem} />
            )}

            {activeTab === 'records' && (
              <RecordsView
                state={state}
                onNavigateFromBadge={(tab, sub) => handleNavigateTab(tab, { studySubTab: sub })}
                onOpenProfileModal={() => setProfileModalMode('edit')}
                onChangeFontSizeScale={handleChangeFontSizeScale}
                onOpenTextbookCode={(code) => {
                  handleApplyTextbookCode(code);
                }}
                onExportJson={handleExportJson}
                onImportJson={handleImportJson}
              />
            )}
          </main>
        </>
      )}

      {/* First-Run Onboarding & Student Profile Modal */}
      {profileModalMode && !adminMode && (
        <ProfileSetupModal
          mode={profileModalMode}
          initialName={state.studentName}
          initialEmoji={state.profileEmoji || DEFAULT_PROFILE_EMOJI}
          initialFontScale={state.fontSizeScale || 'normal'}
          level={state.level}
          hasGoogleUser={Boolean(firebaseUser)}
          onSave={handleUpdateProfile}
          onClose={profileModalMode === 'edit' ? () => setProfileModalMode(null) : undefined}
          onGoogleLogin={handleGoogleLogin}
        />
      )}

      {/* First-Visit / Retake 3-Minute Diagnostic Test Modal */}
      {diagnosticOpen && (
        <DiagnosticTestModal
          studentName={state.studentName}
          onComplete={handleCompleteDiagnostic}
          onSkip={handleSkipDiagnostic}
        />
      )}

      {/* Continuous Study Break Reminder Modal */}
      {breakModalOpen && !adminMode && (
        <BreakReminderModal
          studyMinutesThreshold={state.missionSettings.breakReminderMinutes ?? 40}
          onContinue={() => {
            setBreakModalOpen(false);
            studyTimer.snoozeBreak();
          }}
          onFinishBreakEarly={() => {
            setBreakModalOpen(false);
            studyTimer.resetContinuous();
            notify('잠깐 숨 고르기 완료! 다시 집중해 볼까요?', 'success');
          }}
        />
      )}

      {/* Admin Auth Modal */}
      {adminGateOpen && (
        <AdminAuthModal
          firebaseUser={firebaseUser}
          isGoogleAdmin={isGoogleAdmin}
          adminPin={adminPin}
          onGoogleLogin={handleGoogleLogin}
          onUnlockSuccess={() => {
            setAdminGateOpen(false);
            setAdminMode(true);
            setAdminSubTab('dashboard');
          }}
          onClose={() => setAdminGateOpen(false)}
        />
      )}

      {/* In-App Browser Guidance Modal (KakaoTalk, Naver, Instagram, LINE, etc.) */}
      <InAppBrowserModal
        info={inAppInfo}
        isOpen={inAppModalOpen}
        onClose={() => {
          setInAppModalOpen(false);
          // If closed with "그래도 계속하기", keep top warning banner visible
          setInAppBannerDismissed(false);
        }}
        onCopyUrl={handleCopyCurrentUrl}
        copied={urlCopied}
      />

      {/* In-App Toast Stack (Replaces window.alert) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 print:hidden">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl border-2 px-4 py-3 shadow-lg flex items-center justify-between gap-3 bg-white ${
              t.type === 'success'
                ? 'border-[#4CC38A]'
                : t.type === 'warning'
                  ? 'border-[#FFD166]'
                  : t.type === 'error'
                    ? 'border-[#FF6B57]'
                    : 'border-[#FFE1C2]'
            }`}
          >
            <div className="flex items-start gap-2.5 text-xs font-bold text-[#2B2340] flex-1">
              {t.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CC38A] shrink-0 mt-0.5" />
              ) : t.type === 'error' || t.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-[#FF6B57] shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-[#FF6B57] shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5">
                <div>{t.message}</div>
                {t.actionLabel && t.onAction && (
                  <button
                    type="button"
                    onClick={() => {
                      t.onAction?.();
                      setToasts((prev) => prev.filter((item) => item.id !== t.id));
                    }}
                    className="px-3 py-1 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-[11px] font-extrabold cursor-pointer"
                  >
                    {t.actionLabel}
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-[#2B2340]/45 hover:text-[#2B2340] cursor-pointer shrink-0"
              aria-label="알림 닫기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
