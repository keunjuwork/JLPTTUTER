import { useCallback, useEffect, useRef, useState } from 'react';

interface UseActiveStudyTimerOptions {
  enabled: boolean;
  mode: 'study' | 'game';
  breakReminderEnabled: boolean;
  breakReminderMinutes: number;
  pausedForBreak: boolean;
  onCommitMinute: (mode: 'study' | 'game') => void;
  onReachBreakThreshold: () => void;
}

const IDLE_THRESHOLD_MS = 5 * 60 * 1000; // Pause timer after 5 minutes of no interaction

export function useActiveStudyTimer({
  enabled,
  mode,
  breakReminderEnabled,
  breakReminderMinutes,
  pausedForBreak,
  onCommitMinute,
  onReachBreakThreshold
}: UseActiveStudyTimerOptions) {
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );
  const [isIdlePaused, setIsIdlePaused] = useState(false);
  const [activeSecondsSession, setActiveSecondsSession] = useState(0);
  const [continuousSeconds, setContinuousSeconds] = useState(0);

  const lastInteractionRef = useRef<number>(Date.now());
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const commitRef = useRef(onCommitMinute);
  commitRef.current = onCommitMinute;

  const breakRef = useRef(onReachBreakThreshold);
  breakRef.current = onReachBreakThreshold;

  const breakTriggeredRef = useRef(false);

  const activeSecondsRef = useRef(0);
  const continuousSecondsRef = useRef(0);

  const resetContinuous = useCallback(() => {
    continuousSecondsRef.current = 0;
    setContinuousSeconds(0);
    breakTriggeredRef.current = false;
  }, []);

  const snoozeBreak = useCallback(() => {
    continuousSecondsRef.current = 0;
    setContinuousSeconds(0);
    breakTriggeredRef.current = false;
  }, []);

  // Track document visibility and user input for idle pause
  useEffect(() => {
    const handleVisibility = () => {
      const visible = !document.hidden;
      setIsDocumentVisible(visible);
      if (visible) {
        lastInteractionRef.current = Date.now();
        setIsIdlePaused(false);
      }
    };

    const handleActivity = () => {
      lastInteractionRef.current = Date.now();
      setIsIdlePaused((prev) => (prev ? false : prev));
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pointerdown', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  const isMeasuring = enabled && isDocumentVisible && !isIdlePaused && !pausedForBreak;

  useEffect(() => {
    if (!enabled) return;

    const timer = window.setInterval(() => {
      if (document.hidden || pausedForBreak) {
        return;
      }
      if (Date.now() - lastInteractionRef.current >= IDLE_THRESHOLD_MS) {
        setIsIdlePaused(true);
        return;
      }

      activeSecondsRef.current += 1;
      const nextActive = activeSecondsRef.current;
      setActiveSecondsSession(nextActive);
      if (nextActive % 60 === 0) {
        commitRef.current(modeRef.current);
      }

      continuousSecondsRef.current += 1;
      const nextCont = continuousSecondsRef.current;
      setContinuousSeconds(nextCont);
      const thresholdSecs = Math.max(1, breakReminderMinutes) * 60;
      if (breakReminderEnabled && !breakTriggeredRef.current && nextCont >= thresholdSecs) {
        breakTriggeredRef.current = true;
        breakRef.current();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [enabled, pausedForBreak, breakReminderEnabled, breakReminderMinutes]);

  const timerStatus: 'active' | 'idle' | 'off' = !enabled
    ? 'off'
    : isIdlePaused || !isDocumentVisible || pausedForBreak
      ? 'idle'
      : 'active';

  return {
    isMeasuring,
    isIdlePaused,
    timerStatus,
    activeSecondsSession,
    continuousSeconds,
    resetContinuous,
    snoozeBreak
  };
}
