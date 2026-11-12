# Security Specification — ARI JLPT – アリのにほんご

## 1. Data Invariants
1. **Identity Integrity**: Every document under `/students/{studentUid}`, `/students/{studentUid}/private/{docId}`, `/admins/{adminUid}`, and `/adminSettings/{adminUid}` must bind `uid` strictly to the path ID and `request.auth.uid` (unless an authenticated verified `isAdmin()` performs an authorized admin action on a student's mission/praise/shop catalog fields).
2. **PII Isolation**: User email addresses are stored exclusively in `/students/{studentUid}/private/account` and `/admins/{adminUid}`, readable only by the document owner or a verified admin.
3. **Zero Privilege Escalation**: Regular student users cannot create or update `/admins/{adminUid}` or `/adminSettings/{adminUid}`, nor can they inject arbitrary keys (`Ghost Fields`) into `/students/{studentUid}`.
4. **Tiered Update Boundaries**:
   - **Student Owner** may update learning progress (`studentName`, `profileEmoji`, `profileConfigured`, `diagnosticCompleted`, `diagnosticResult`, `level`, `exp`, `coins`, `gameExpToday`, `gameExpDate`, `fontSizeScale`, `lastStudyLocation`, `targetLevel`, `subLevel`, `streak`, `lastStudyDate`, `streakDates`, `streakProtections`, `currentStageId`, `unlockedStages`, `completedStages`, `learnedKana`, `bookmarkedKana`, `learnedVocab`, `bookmarkedVocab`, `learnedKanji`, `bookmarkedKanji`, `learnedGrammar`, `fourWeekPlanChecks`, `kanaStats`, `srsItems`, `badges`, `cultureCards`, `mockExamHistory`, `wrongNoteEntries`, `purchasedItems`, `gameRecords`, `studyLogs`, `dailyMissions`, `acknowledgedPraiseIds`, `textbookProgress`, `lastBackupAt`, `startDate`, `updatedAt`), while `uid` and `createdAt` remain immutable and admin-controlled fields (`missionSettings`, `praiseMessages`, `shopCatalog`) cannot be overwritten by non-admin students.
   - **Admin (`isAdmin()`)** retains Tier 1 authority to adjust mission settings, Kana Drop difficulty time limits, praise messages, reward shop catalog items, coin/EXP grants, and coupon redemption approvals.
5. **Temporal Integrity**: `createdAt == request.time` on creation, `updatedAt == request.time` on creation and update, and `createdAt` is immutable on update.
6. **Bounded Payloads**: All strings enforce `.size()` limits, all document IDs match `^[a-zA-Z0-9_\\-]+$` and `<= 128` chars, and all arrays enforce bounded `.size()`.
7. **Wrong Notes Isolation**: `wrongNoteEntries` (both `/students/{studentUid}/wrongNotes/{entryId}` and `/wrongNoteEntries/{entryId}`) are strictly bound to `studentUid == request.auth.uid`. Cross-user inspection or manipulation is strictly prohibited.
8. **Server-Only AI Quota Lockdown**: The `/aiUsage/{usageDocId}` collection is strictly denied from all client-side read and write requests (`allow read, write: if false;`), ensuring AI query quotas are managed solely via the serverless function (`/api/ai-teacher.ts`) with Firebase Admin credentials.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Student Read**: Anonymous client attempts `get /students/user123`.
2. **Cross-Student Read**: Student `userA` attempts `get /students/userB`.
3. **Blanket Student List Scraping**: Non-admin student `userA` attempts `list /students`.
4. **PII Leak Attempt**: Student `userA` attempts `get /students/userB/private/account`.
5. **Cross-Student Wrong Note Access**: Student `userA` attempts `get /wrongNoteEntries/entryB` or `get /students/userB/wrongNotes/entryB`.
6. **Client-Side AI Quota Reset**: Student `userA` attempts write or read on `/aiUsage/userA_2026-11-12`.
7. **Self-Admin Escalation**: Student `userA` attempts `create /admins/userA` with `{ uid: 'userA', role: 'admin' }`.
8. **Unverified Admin Email Spoof**: User with `email: 'ai.kj1207@gmail.com'` and `email_verified: false` attempts admin write.
9. **Shadow / Ghost Field Injection**: Student `userA` updates `/students/userA` adding `{ isAdmin: true }`.
10. **Identity Spoofing on Create**: Student `userA` creates `/students/userA` with `{ uid: 'userB' }`.
11. **Immutable Timestamp Tampering**: Student `userA` updates `/students/userA` modifying `createdAt`.
12. **Student Tampering with Admin Mission Settings / Shop Catalog**: Non-admin student `userA` attempts `update /students/userA` changing `missionSettings.dailyNewChars` or `shopCatalog` prices.
