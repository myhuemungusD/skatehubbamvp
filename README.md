# SkateHubba

A simple skateboarding challenges MVP built with **Next.js** and **Firebase**. Goal: let skaters browse challenges, submit clips, and track progression.

## What This Is (Plain English)
- Web app (React + Next.js)
- Uses Firebase for backend pieces (Auth, Firestore, Functions, future Storage)
- Early stage — structure will improve over time

## Current / Planned Features
- View challenges (basic)
- (Planned) Submit a video/clip
- (Planned) Challenge approvals / moderation
- (Planned) User profiles & badges
- (Planned) Leaderboards / streaks
- (Planned) Social sharing

## Tech Stack
| Part | Tool | Why |
|------|------|-----|
| UI | Next.js | Fast dev + SEO capable |
| Auth | Firebase Auth | Handles login/session |
| Data | Firestore | Real-time & simple |
| Backend logic | Firebase Functions | Serverless (no server to manage) |
| Media (planned) | Firebase Storage | Video / image uploads |

## Running Locally (After Cleanup Pass)
1. Install Node.js (v18+).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a file called `.env.local` in the project root with your Firebase keys:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=yourKey
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourProject.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourProjectId
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourProject.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

(If functions dev needed) run Firebase emulators:
```bash
firebase emulators:start
```

## Folder Structure (Target Layout)
```
/
├─ src/            (pages or app/, components, hooks, lib)
├─ public/
├─ functions/      (Firebase Cloud Functions)
├─ README.md
├─ .gitignore
├─ package.json
└─ (other config files)
```

## Contributing (Short Version)
Open an issue first for new features. Small pull requests are easier to review. See CONTRIBUTING.md for details.

## Roadmap (Simple)
- [ ] Clean root structure (later)
- [ ] Challenges CRUD
- [ ] Clip uploads
- [ ] Moderation flow
- [ ] User profiles
- [ ] Badges / progression
- [ ] Leaderboards
- [ ] Social sharing

## License
MIT — free to use and adapt (see LICENSE).

## Security
See SECURITY.md to report issues privately.

SkateHubba — progress, style, community.
