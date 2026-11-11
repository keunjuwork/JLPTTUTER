import React from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { GameZoneView } from './components/GameZoneView';
import { HomeView } from './components/HomeView';
import { LearningLabView } from './components/LearningLabView';
import { PrintCenterView } from './components/PrintCenterView';
import { RecordsView } from './components/RecordsView';
import { StudentHeader } from './components/StudentHeader';
import { ADVENTURE_STAGES } from './data/adventureRoadmapData';
import { CULTURE_CARDS } from './data/cultureAndBadgesData';
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
import { playSfx } from './lib/speech';
import {
  createInitialStudentState,
  createSamplePopulatedState,
  evaluateBadges,
  exportBackupJson,
  getLocalAdminPin,
  getMissionCountSummary,
  getTodayKey,
  loadLocalStudentState,
  normalizeDailyState,
  parseBackupJson,
  recordKanaAttempt,
  recordStudyActivity,
  saveLocalStudentState,
  setLocalAdminPin
} from './lib/storage';
import {
  AdminSubTab,
  AdventureStage,
  JlptLevel,
  MainTab,
  PrintSubTab,
  StudentState,
  StudySubTab,
  SubDifficulty,
  ToastItem
} from './types';

export default function App() {
  const [state, setState] = React.useState<StudentState>(() => loadLocalStudentState());
  const [activeTab, setActiveTab] = React.useState<MainTab>('home');
  const [studySubTab, setStudySubTab] = React.useState<StudySubTab>('kana');
  const [selectedRowId, setSelectedRowId] = React.useState<string>('row_a');
  const [printSubTab, setPrintSubTab] = React.useState<PrintSubTab>('rowSheet');
  const [printPairId, setPrintPairId] = React.useState<string>('pair_sa_ki');

  // Firebase Auth & Sync State
  const [firebaseUser, setFirebaseUser] = React.useState<User | null>(null);
  const [isGoogleAdmin, setIsGoogleAdmin] = React.useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = React.useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const cloudHydratedRef = React.useRef(false);

  // Admin State
  const [adminGateOpen, setAdminGateOpen] = React.useState(false);
  const [adminMode, setAdminMode] = React.useState(false);
  const [adminSubTab, setAdminSubTab] = React.useState<AdminSubTab>('dashboard');
  const [adminPin, setAdminPin] = React.useState<string>(() => getLocalAdminPin());
  const [studentsList, setStudentsList] = React.useState<StudentState[]>([]);
  const [adminSelectedUid, setAdminSelectedUid] = React.useState<string>('');

  // Toasts
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const notify = React.useCallback(
    (message: string, type: ToastItem['type'] = 'info') => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

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
          setCloudSyncStatus('synced');
          notify(`${cloudState.studentName}의 클라우드 기록을 불러왔어요!`, 'success');
        } else {
          // First-time cloud save from current local state
          const initialName = user.displayName?.split(' ')[0] || state.studentName || '지우';
          const seeded = { ...state, uid: user.uid, studentName: initialName };
          setState(seeded);
          setAdminSelectedUid(user.uid);
          await saveStudentToCloud(user, seeded, { asAdmin: adminOk });
          cloudHydratedRef.current = true;
          setCloudSyncStatus('synced');
          notify('Google 계정과 학습 기록을 연결했어요!', 'success');
        }
      } catch {
        setCloudSyncStatus('error');
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 0.7s Debounced Cloud Sync whenever student state changes while signed in
  React.useEffect(() => {
    if (!firebaseUser || !cloudHydratedRef.current) return;
    setCloudSyncStatus('syncing');

    const timer = setTimeout(() => {
      const targetUid = adminMode && adminSelectedUid ? adminSelectedUid : firebaseUser.uid;
      saveStudentToCloud(firebaseUser, state, {
        asAdmin: isGoogleAdmin && adminMode,
        targetUid
      })
        .then(() => {
          setCloudSyncStatus('synced');
        })
        .catch(() => {
          setCloudSyncStatus('error');
        });
    }, 700);

    return () => clearTimeout(timer);
  }, [state, firebaseUser, isGoogleAdmin, adminMode, adminSelectedUid]);

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

  const handleGoogleLogin = async () => {
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
    opts?: { studySubTab?: StudySubTab; rowId?: string; printSubTab?: PrintSubTab; pairId?: string }
  ) => {
    setActiveTab(tab);
    if (opts?.studySubTab) setStudySubTab(opts.studySubTab);
    if (opts?.rowId) setSelectedRowId(opts.rowId);
    if (opts?.printSubTab) setPrintSubTab(opts.printSubTab);
    if (opts?.pairId) setPrintPairId(opts.pairId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStage = (stage: AdventureStage) => {
    if (!state.unlockedStages.includes(stage.id)) {
      notify('앞 단계 퀴즈를 80% 이상 통과하면 다음 모험이 열려요!', 'info');
      return;
    }
    if (!stage.phase1Ready) {
      notify(`「${stage.title}」은 2차 업데이트(어휘·한자·문법·모의고사)에서 본격 탐험할 수 있어요! 먼저 목표 급수를 설정하고 시험 정보를 확인해 보세요.`, 'info');
      return;
    }
    setState((prev) => ({ ...prev, currentStageId: stage.id }));
    setActiveTab('study');
    setStudySubTab('kana');
    if (stage.id === 'stage_basics') {
      setSelectedRowId('basics_preview');
    } else if (stage.rowId) {
      setSelectedRowId(stage.rowId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          studyMinutes: 2
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

  const handleRecordAttempt = React.useCallback((char: string, isCorrect: boolean, confusedChar?: string) => {
    setState((prev) => {
      let next = recordKanaAttempt(prev, char, isCorrect, confusedChar);
      next = recordStudyActivity(next, {
        expGain: isCorrect ? 10 : 2,
        quizAttempts: 1,
        quizCorrect: isCorrect ? 1 : 0
      });
      return evaluateBadges(next);
    });
  }, []);

  const handleCompleteStageQuiz = (
    stageId: string,
    scorePercent: number,
    _correctCount: number,
    _totalCount: number
  ) => {
    setState((prev) => {
      let next = recordStudyActivity(prev, {
        expGain: scorePercent >= 80 ? 80 : 20,
        studyMinutes: 4
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
          studyMinutes: Math.max(2, Math.round(reviewedCount * 0.5))
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
          studyMinutes: 2
        }
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleFinishKanaDrop = (score: number, durationMinutes: number) => {
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
            kanaDropBest: Math.max(prev.gameRecords.kanaDropBest, score),
            kanaDropPlaysToday: prev.gameRecords.kanaDropPlaysToday + 1
          },
          dailyMissions: {
            ...prev.dailyMissions,
            gamesPlayed: nextGamesPlayed
          }
        },
        {
          expGain: Math.max(15, Math.round(score / 40)) + (hitMission ? 30 : 0),
          gameMinutes: durationMinutes
        }
      );

      notify(
        hitMission
          ? `가나 낙하 게임 ${score.toLocaleString()}점! 오늘의 게임 미션 달성 +30 EXP!`
          : `가나 낙하 게임 ${score.toLocaleString()}점 기록 저장 완료!`,
        'success'
      );
      return withSyncedMissionLog(next);
    });
  };

  const handleFinishListeningGame = (score: number, durationMinutes: number) => {
    setState((prev) => {
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
            gamesPlayed: prev.dailyMissions.gamesPlayed + 1
          }
        },
        {
          expGain: Math.max(15, Math.round(score / 30)),
          gameMinutes: durationMinutes
        }
      );
      notify(`듣고 글자 고르기 ${score}점 저장 완료!`, 'success');
      return withSyncedMissionLog(next);
    });
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
  const handleExportJson = () => {
    const nowIso = new Date().toISOString();
    const updatedState = { ...state, lastBackupAt: nowIso };
    setState(updatedState);
    const json = exportBackupJson(updatedState);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirai-jlpt-backup-${getTodayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify('JSON 백업 파일이 다운로드되었어요!', 'success');
  };

  const handleImportJson = (raw: string) => {
    const parsed = parseBackupJson(raw);
    if (!parsed) {
      notify('올바른 백업 JSON 파일이 아니에요. 파일을 확인해 주세요.', 'error');
      return;
    }
    setState(parsed);
    notify(`${parsed.studentName}의 백업 기록을 복원했어요!`, 'success');
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
    notify('학생 홈에 칭찬 메시지와 보너스 EXP 선물을 보냈어요!', 'success');
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
          onSendPraise={handleAdminSendPraise}
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
            const sample = createSamplePopulatedState(state.uid, state.studentName);
            setState(sample);
            notify('15일 학습 샘플 데이터를 불러왔어요! 대시보드 차트와 히트맵을 확인해 보세요.', 'success');
          }}
          onResetStudentData={() => {
            const fresh = normalizeDailyState(createInitialStudentState(state.uid, state.studentName));
            setState(fresh);
            notify('0단계 초기 상태로 되돌렸어요.', 'info');
          }}
        />
      ) : (
        <>
          <StudentHeader
            activeTab={activeTab}
            onSelectTab={(tab) => handleNavigateTab(tab)}
            studentName={state.studentName}
            level={state.level}
            firebaseUser={firebaseUser}
            cloudSyncStatus={cloudSyncStatus}
            onGoogleLogin={handleGoogleLogin}
            onGoogleLogout={handleGoogleLogout}
            onOpenAdminGate={() => setAdminGateOpen(true)}
          />

          <main className="pb-12">
            {activeTab === 'home' && (
              <HomeView
                state={state}
                onNavigateTab={handleNavigateTab}
                onSelectStage={handleSelectStage}
                onChangeLevelScope={handleChangeLevelScope}
                onToggleRoutine={handleToggleRoutine}
                onAcknowledgePraise={handleAcknowledgePraise}
                onNotify={notify}
              />
            )}

            {activeTab === 'study' && (
              <LearningLabView
                state={state}
                subTab={studySubTab}
                selectedRowId={selectedRowId}
                onChangeSubTab={setStudySubTab}
                onSelectRow={setSelectedRowId}
                onMarkKanaLearned={handleMarkKanaLearned}
                onToggleBookmark={handleToggleBookmark}
                onRecordAttempt={handleRecordAttempt}
                onCompleteStageQuiz={handleCompleteStageQuiz}
                onCompleteSrsSession={handleCompleteSrsSession}
                onCompleteSpeakingMission={handleCompleteSpeakingMission}
                onOpenPrintForPair={(pairId, tab) => {
                  setPrintPairId(pairId);
                  setPrintSubTab(tab);
                  setActiveTab('print');
                }}
                onNotify={notify}
              />
            )}

            {activeTab === 'game' && (
              <GameZoneView
                state={state}
                onFinishKanaDrop={handleFinishKanaDrop}
                onFinishListeningGame={handleFinishListeningGame}
                onRecordAttempt={handleRecordAttempt}
                onNotify={notify}
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

            {activeTab === 'records' && (
              <RecordsView
                state={state}
                onNavigateFromBadge={(tab, sub) => handleNavigateTab(tab, { studySubTab: sub })}
                onExportJson={handleExportJson}
                onImportJson={handleImportJson}
              />
            )}
          </main>
        </>
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
            <div className="flex items-center gap-2.5 text-xs font-bold text-[#2B2340]">
              {t.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CC38A] shrink-0" />
              ) : t.type === 'error' || t.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-[#FF6B57] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#FF6B57] shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-[#2B2340]/45 hover:text-[#2B2340] cursor-pointer"
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
