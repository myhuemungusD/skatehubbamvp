# 🛹 SkateHubba MVP

**Own Your Tricks.**  
SkateHubba™ is a mobile/web app that brings skateboarding culture online.  
Play SKATE remotely, upload trick clips, check in at spots, and build your skate legacy.

---

## 🚀 Tech Stack
- **Next.js 14 (App Router)**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Firebase** (Auth, Firestore, Storage, Extensions)
- **React Query** for caching and sync
- **shadcn/ui** components
- **Zustand** state management

---

## 📂 Project Structure
skatehubbamvp/
├── src/
│ ├── app/ # Next.js routes
│ │ ├── game/[gameId]/ # Game room
│ │ ├── lobby/ # Lobby
│ │ ├── gallery/ # Global trick feed
│ │ └── verify/ # Email verification
│ ├── components/ # Shared UI components
│ ├── hooks/ # Firestore hooks (queries, mutations)
│ ├── lib/ # Firebase setup, game logic
│ └── types/ # TypeScript interfaces

---

## 🎮 Features
- ✅ Create/join SKATE games
- ✅ Real-time turn system
- ✅ Trick video uploads
- ✅ SKATE letter progression
- ✅ Winner detection
- ✅ User authentication & profiles
- ✅ Email notifications
- ✅ Firestore + Storage security rules
- ✅ Global Trick Gallery with voting

---

## ⚠️ Current Issues
- Fix missing imports in `firestoreMutations.ts`
- Adjust `handleTrickUpload` signatures
- Restore `globals.css` in `layout.tsx`
- Remove duplicate route (`/game/[id]`)

---

## 🛠️ Getting Started

### 1. Clone Repo
```bash
git clone https://github.com/your-username/skatehubbamvp.git
cd skatehubbamvp
