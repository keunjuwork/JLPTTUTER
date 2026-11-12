/**
 * Dirty Dozen Security Rule Verification Spec
 * Maps all 12 adversarial payloads against the expected PERMISSION_DENIED outcomes
 * enforced by firestore.rules.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update';
  path: string;
  auth: {
    uid: string | null;
    email?: string;
    email_verified?: boolean;
  };
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
  enforcedBy: string;
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Student Read',
    operation: 'get',
    path: '/students/user123',
    auth: { uid: null },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'isSignedIn()'
  },
  {
    id: 2,
    name: 'Cross-Student Read',
    operation: 'get',
    path: '/students/userB',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'isOwner(studentUid) || isAdmin()'
  },
  {
    id: 3,
    name: 'Blanket Student List Scraping',
    operation: 'list',
    path: '/students',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'isAdmin() || resource.data.uid == request.auth.uid'
  },
  {
    id: 4,
    name: 'PII Leak Attempt',
    operation: 'get',
    path: '/students/userB/private/account',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'isOwner(studentUid) || isAdmin()'
  },
  {
    id: 5,
    name: 'Cross-Student Wrong Note Access',
    operation: 'get',
    path: '/wrongNoteEntries/entryB',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'isOwner(resource.data.studentUid) || isAdmin()'
  },
  {
    id: 6,
    name: 'Client-Side AI Quota Reset',
    operation: 'create',
    path: '/aiUsage/userA_2026-11-12',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    payload: { uid: 'userA', date: '2026-11-12', count: 0 },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'match /aiUsage/{usageDocId} { allow read, write: if false; }'
  },
  {
    id: 7,
    name: 'Self-Admin Escalation',
    operation: 'create',
    path: '/admins/userA',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    payload: { uid: 'userA', email: 'a@example.com', role: 'admin' },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'isAdmin() on /admins create'
  },
  {
    id: 8,
    name: 'Unverified Admin Email Spoof',
    operation: 'create',
    path: '/admins/spoofUid',
    auth: { uid: 'spoofUid', email: 'ai.kj1207@gmail.com', email_verified: false },
    payload: { uid: 'spoofUid', email: 'ai.kj1207@gmail.com', role: 'admin' },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'request.auth.token.email_verified == true'
  },
  {
    id: 9,
    name: 'Shadow / Ghost Field Injection',
    operation: 'update',
    path: '/students/userA',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    payload: { isAdmin: true },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'data.keys().hasOnly(...) & affectedKeys().hasOnly(...)'
  },
  {
    id: 10,
    name: 'Identity Spoofing on Create',
    operation: 'create',
    path: '/students/userA',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    payload: { uid: 'userB', studentName: 'Spoof' },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'data.uid == studentUid && isOwner(studentUid)'
  },
  {
    id: 11,
    name: 'Immutable Timestamp Tampering',
    operation: 'update',
    path: '/students/userA',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'incoming().createdAt == existing().createdAt'
  },
  {
    id: 12,
    name: 'Student Tampering with Admin Mission Settings / Shop Catalog',
    operation: 'update',
    path: '/students/userA',
    auth: { uid: 'userA', email: 'a@example.com', email_verified: true },
    payload: { missionSettings: { dailyNewChars: 0 }, shopCatalog: [] },
    expected: 'PERMISSION_DENIED',
    enforcedBy: 'Tier 2 affectedKeys excludes missionSettings, praiseMessages & shopCatalog'
  }
];
