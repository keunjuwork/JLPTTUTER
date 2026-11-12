// In-App Browser Detector & External Browser Redirect Utility
// Specifically targets Korean and common social in-app browsers where Web Speech API (speechSynthesis)
// and Web Audio (AudioContext) or Google OAuth popups fail/stall silently.

export type InAppBrowserType =
  | 'kakaotalk'
  | 'naver'
  | 'instagram'
  | 'facebook'
  | 'line'
  | 'daum'
  | 'whale'
  | 'other_inapp'
  | null;

export interface InAppBrowserInfo {
  isInApp: boolean;
  type: InAppBrowserType;
  appName: string;
  isIOS: boolean;
  isAndroid: boolean;
  userAgent: string;
}

export function detectInAppBrowser(): InAppBrowserInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isInApp: false,
      type: null,
      appName: '',
      isIOS: false,
      isAndroid: false,
      userAgent: ''
    };
  }

  const ua = navigator.userAgent || '';
  const uaLower = ua.toLowerCase();

  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);

  let type: InAppBrowserType = null;
  let appName = '';

  if (/kakaotalk/i.test(ua)) {
    type = 'kakaotalk';
    appName = '카카오톡';
  } else if (/naver\(/i.test(ua) || /naversearchapp/i.test(ua)) {
    type = 'naver';
    appName = '네이버 앱';
  } else if (/instagram/i.test(ua)) {
    type = 'instagram';
    appName = '인스타그램';
  } else if (/fban|fbav|facebook/i.test(ua)) {
    type = 'facebook';
    appName = '페이스북';
  } else if (/line\//i.test(ua)) {
    type = 'line';
    appName = '라인 (LINE)';
  } else if (/daumapps/i.test(ua)) {
    type = 'daum';
    appName = '다음 앱';
  } else if (/whale/i.test(ua) && (uaLower.includes('inapp') || !uaLower.includes('chrome/'))) {
    type = 'whale';
    appName = '웨일 인앱';
  } else if (/everytimeapp/i.test(ua)) {
    type = 'other_inapp';
    appName = '에브리타임';
  } else if (/band\//i.test(ua)) {
    type = 'other_inapp';
    appName = '밴드';
  } else if (/wv|webview/i.test(uaLower)) {
    type = 'other_inapp';
    appName = '인앱 브라우저';
  }

  return {
    isInApp: type !== null,
    type,
    appName: appName || (type ? '앱 안 브라우저' : ''),
    isIOS,
    isAndroid,
    userAgent: ua
  };
}

const IN_APP_REDIRECT_ATTEMPTED_KEY = 'ari_inapp_redirect_attempted_v1';

/**
 * Attempt to auto-escape the in-app browser to the system default browser.
 * Preserves the full URL including query params (?code=H-KA etc.) and hash.
 * Guards against infinite loops by recording in sessionStorage (once per session).
 *
 * Returns true if an auto-redirect was initiated, false otherwise.
 */
export function attemptAutoExternalBrowserOpen(info: InAppBrowserInfo): boolean {
  if (typeof window === 'undefined' || !info.isInApp) return false;

  try {
    const alreadyAttempted = sessionStorage.getItem(IN_APP_REDIRECT_ATTEMPTED_KEY);
    if (alreadyAttempted === 'true') {
      return false;
    }
    sessionStorage.setItem(IN_APP_REDIRECT_ATTEMPTED_KEY, 'true');
  } catch {
    // sessionStorage not available (e.g. strict private mode); do not loop
    return false;
  }

  const currentHref = window.location.href;

  // 1. KakaoTalk (iOS & Android common custom scheme)
  if (info.type === 'kakaotalk') {
    const kakaoExternalUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentHref)}`;
    try {
      window.location.href = kakaoExternalUrl;
      return true;
    } catch {
      return false;
    }
  }

  // 2. LINE (openExternalBrowser=1 query parameter)
  if (info.type === 'line') {
    try {
      const url = new URL(currentHref);
      if (url.searchParams.get('openExternalBrowser') !== '1') {
        url.searchParams.set('openExternalBrowser', '1');
        window.location.href = url.toString();
        return true;
      }
    } catch {
      // url parse failure
    }
    return false;
  }

  // 3. Android other in-app browsers (Naver, Instagram, Facebook, Daum, etc.) -> Chrome intent
  if (info.isAndroid) {
    try {
      const url = new URL(currentHref);
      // Format: intent://<host><path><query>#Intent;scheme=https;package=com.android.chrome;end
      const hostAndPath = `${url.host}${url.pathname}${url.search}${url.hash}`;
      const intentUrl = `intent://${hostAndPath}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
      return true;
    } catch {
      return false;
    }
  }

  // 4. iOS other in-app browsers (Instagram, Naver, Facebook on iOS):
  // iOS has no universal chrome/safari deep-link without user tapping "Open in Safari" from app menu
  return false;
}
