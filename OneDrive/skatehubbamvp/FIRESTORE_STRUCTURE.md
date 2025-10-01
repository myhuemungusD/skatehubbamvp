# SkateHubba Firestore Structure

## 🔑 User Profiles (UID→Email Mapping)
```
users/{uid}
├── email: "player@skatehubba.com"
├── displayName: "SkaterPro"
├── createdAt: 1696000000000
├── updatedAt: 1696000000000
└── stats: {
    gamesPlayed: 15,
    gamesWon: 8,
    gamesLost: 7,
    tricksLanded: 42,
    tricksMissed: 13
}
```

## 🎮 Game Documents
```
games/{gameId}
├── createdBy: "uid_player1"        // ← UID only, no email stored
├── opponent: "uid_player2"         // ← UID only, no email stored  
├── letters: {
│   "uid_player1": "SK",           // Player 1 has S and K letters
│   "uid_player2": ""              // Player 2 has no letters yet
├── }
├── turn: "uid_player2"            // ← UID of whose turn it is
├── status: "in-progress"
├── createdAt: 1696000000000
└── updatedAt: 1696000000000
```

## 🎥 Game Rounds (Trick Videos)
```
games/{gameId}/rounds/{roundId}
├── player: "uid_player1"          // ← UID of who uploaded
├── videoUrl: "https://storage..."
├── trickName: "Kickflip"
├── isResponse: false
├── landed: true
└── createdAt: 1696000000000
```

## 📧 Email Queue (Firebase Extension)
```
mail/{emailId}
├── to: ["player@skatehubba.com"]   // ← Email from users/{uid} lookup
└── message: {
    subject: "Your turn in SKATE",
    text: "Opponent uploaded a trick. Respond here: https://skatehubba.com/game/abc123"
}
```

## 🔄 Complete Data Flow

### Turn Notification Flow:
1. **Game State**: `turn: "uid_player2"` 
2. **Lookup Email**: `users/uid_player2` → `"player2@skatehubba.com"`
3. **Queue Email**: Create doc in `mail/` collection
4. **Send Email**: Firebase extension processes mail queue
5. **Player Notified**: "Your turn in SKATE" email sent

### Privacy Benefits:
- ✅ Game documents never store emails (privacy-safe)
- ✅ Only UIDs exposed in game state
- ✅ Email lookup happens server-side via Firestore rules
- ✅ Players can't see opponents' emails directly

### Scalability Benefits:
- ✅ User profiles cached and indexed by UID
- ✅ Game queries don't need email joins  
- ✅ Email changes only require updating one document
- ✅ Firebase extension handles email delivery reliably

This structure enables secure, scalable multiplayer SKATE games with automatic email notifications! 🛹✨