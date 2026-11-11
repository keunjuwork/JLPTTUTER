# Security Specification — 미라이 JLPT – にほんご 모험

## 1. Data Invariants
1. **Identity Integrity**: Every document under `/students/{studentUid}`, `/students/{studentUid}/private/{docId}`, `/admins/{adminUid}`, and `/adminSettings/{adminUid}` must bind `uid` strictly to the path ID and `request.auth.uid` (unless an authenticated verified `isAdmin()` performs an authorized admin action on a student's mission/praise fields).
2. **PII Isolation**: User email addresses are stored exclusively in `/students/{studentUid}/private/account` and `/admins/{adminUid}`, readable only by the document owner or a verified admin.
3. **Zero Privilege Escalation**: Regular student users cannot create or update `/admins/{adminUid}` or `/adminSettings/{adminUid}`, nor can they inject arbitrary keys (`Ghost Fields`) into `/students/{studentUid}`.
4. **Tiered Update Boundaries**:
   - **Student Owner** may update learning progress (`studentName`, `level`, `exp`, `streak`, `lastStudyDate`, `streakDates`, `streakProtections`, `currentStageId`, `unlockedStages`, `completedStages`, `learnedKana`, `bookmarkedKana`, `kanaStats`, `srsItems`, `badges`, `cultureCards`, `gameRecords`, `studyLogs`, `dailyMissions`, `praiseMessages`, `lastBackupAt`, `targetLevel`, `subLevel`, `startDate`, `updatedAt`), while `uid` and `createdAt` remain immutable and `missionSettings` cannot be overwritten by a student once locked, OR wait: student can initialize default `missionSettings` at creation; on update, only admin modifies `missionSettings` (unless student initialized locally—wait: let's keep `missionSettings` strictly Admin-only on `update` if Admin manages it, OR allow student sync of `missionSettings` only if not admin-overridden? Better: strictly separate `AdminMissionAction` vs `StudentSyncAction` or allow student owner to sync only learning fields while admin updates `missionSettings`, `praiseMessages`, `targetLevel`, `subLevel`, `exp`, `updatedAt`!).
   - Wait: what if a single user is ALSO the admin (`ai.kj1207@gmail.com`) and sets missions locally before signing in, then signs in and syncs? Since `isAdmin()` has the override escape hatch, `ai.kj1207@gmail.com` passes `isAdmin()`, AND for regular non-admin students, locking `missionSettings` against student tampering on `update` enforces real Tiered Identity Logic!
5. **Temporal Integrity**: `createdAt == request.time` on creation, `updatedAt == request.time` on creation and update, and `createdAt` is immutable on update.
6. **Bounded Payloads**: All strings enforce `.size()` limits, all document IDs match `^[a-zA-Z0-9_\\-]+$` and `<= 128` chars, and all arrays enforce bounded `.size()`.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Student Read**: Anonymous client attempts `get /students/user123`.
2. **Cross-Student Read**: Student `userA` attempts `get /students/userB`.
3. **Blanket Student List Scraping**: Non-admin student `userA` attempts `list /students`.
4. **PII Leak Attempt**: Student `userA` attempts `get /students/userB/private/account`.
5. **Self-Admin Escalation**: Student `userA` attempts `create /admins/userA` with `{ uid: 'userA', role: 'admin' }`.
6. **Unverified Admin Email Spoof**: User with `email: 'ai.kj1207@gmail.com'` and `email_verified: false` attempts admin write.
7. **Shadow / Ghost Field Injection**: Student `userA` updates `/students/userA` adding `{ isAdmin: true }`.
8. **Identity Spoofing on Create**: Student `userA` creates `/students/userA` with `{ uid: 'userB' }`.
9. **Immutable Timestamp Tampering**: Student `userA` updates `/students/userA` modifying `createdAt`.
10. **Forged Client Timestamp**: Student `userA` updates `/students/userA` with `updatedAt: '2026-01-01'` instead of `request.time`.
11. **Oversized ID Poisoning**: Client attempts write to `/students/${'a'.repeat(500)}`.
12. **Student Tampering with Admin Mission Settings**: Non-admin student `userA` attempts `update /students/userA` changing `missionSettings.dailyNewChars` to `0`.
