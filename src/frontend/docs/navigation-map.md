# Navigation Map

This document describes the routing structure of the Swaraj Infotech application.

## Route Structure

The application uses hash-based routing for client-side navigation. All routes are defined in `frontend/src/routes.ts`.

### Available Routes

| Route | Path | Description | Params |
|-------|------|-------------|--------|
| Dashboard | `#dashboard` | Main course dashboard with feature cards and quick stats | None |
| Practice Mode | `#practice` | Practice questions at your own pace | `?course=X&chapter=Y&questionId=Z` (optional) |
| Chapter Test | `#chapter-test` | Test knowledge chapter by chapter | None |
| Exam Mode | `#exam` | Full exam simulation with timer | `?mode=X&attemptId=Y` (optional) |
| Progress | `#progress` | Track learning progress and chapter completion | None |
| Share App | `#share` | Share the app with friends | None |
| Profile | `#profile` | View and manage user profile | None |
| Tests | `#tests` | View all test results and history | None |
| Bookmarks | `#bookmarks` | Saved questions and topics | None |

## Navigation Flow

### Primary Navigation (Bottom Nav)
- **Home** → Dashboard (`#dashboard`)
- **Tests** → Tests Screen (`#tests`)
- **Bookmarks** → Bookmarks Screen (`#bookmarks`)
- **Profile** → Profile Screen (`#profile`)

### Dashboard Feature Cards
From the dashboard, users can navigate to:
- Practice Mode (`#practice`)
- Chapter Test (`#chapter-test`)
- Exam Mode (`#exam`)
- Progress (`#progress`)
- Share App (`#share`)
- Profile (`#profile`)

### Practice Mode Flow
Practice Mode supports a 3-step flow within the screen:
1. **Chapter Selection** - Select a chapter to practice
2. **Question List** - View all questions in the selected chapter
3. **Question View** - Practice individual questions with hints, answers, and explanations

#### Deep Linking
Practice Mode supports URL parameters for deep linking:
- `course` - The course identifier (e.g., "MSCIT")
- `chapter` - The chapter name
- `questionId` - Specific question ID to open directly

Example: `#practice?course=MSCIT&chapter=Data%20Types&questionId=42`

The Bookmarks screen uses these parameters to deep-link into Practice Mode when a bookmarked question is clicked.

### Exam Mode Flow
Exam Mode supports a multi-step flow within the screen:
1. **Start Panel** - View exam rules and start a new exam or view history
2. **Attempt Panel** - Take the exam with timer and navigation controls
3. **Results Panel** - View score, accuracy, time used, and weak chapters
4. **History Panel** - View all past exam attempts
5. **Review Panel** - Review a specific attempt with answers and explanations

#### Deep Linking
Exam Mode supports URL parameters for internal navigation:
- `mode` - The current view (`start`, `attempt`, `results`, `history`, `review`)
- `attemptId` - Specific attempt ID for review

Examples:
- `#exam` - Default start view
- `#exam?mode=history` - View exam history
- `#exam?mode=review&attemptId=123` - Review specific attempt

## Implementation Details

### Hash-Based Routing
The application uses `useHashRoute` hook for navigation:
- Routes are identified by the hash fragment (e.g., `#practice`)
- Query parameters are appended after the hash (e.g., `#practice?chapter=X`)
- The `useHashRoute` hook provides `currentRoute` and `navigate(route)` function
- Navigation within Practice Mode and Exam Mode is handled by internal state, not route changes

### Offline Support
Practice Mode includes offline caching:
- Questions are cached per (course, chapter) in localStorage
- Bookmarks are cached for offline access
- Answer submissions and bookmark toggles are queued in an "outbox" when offline
- Queued actions automatically sync when the app comes back online
- UI displays offline status and pending sync count
