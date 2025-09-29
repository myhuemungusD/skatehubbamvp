# SkateHubba MVP

A Next.js + Firebase app designed for skateboarding challenges and community engagement.

## 🛹 About

SkateHubba is a platform that brings together skateboarding enthusiasts through interactive challenges, video sharing, and competitive gameplay. Built with modern web technologies for optimal performance and user experience.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.3
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Firebase project setup

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/myhuemungusD/skatehubbamvp.git
   cd skatehubbamvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## ☁️ Cloud Functions

This project includes Cloud Functions for submission moderation with role-based authorization.

### Functions Available

- **approveSubmission**: Approve a submission (mod/admin only)
  - Increments user points based on challenge configuration
  - Creates audit trail and activity entries
  - Prevents self-approval
  
- **rejectSubmission**: Reject a submission (mod/admin only)
  - Creates audit trail (no points awarded)
  - Does not create activity entries per product spec
  - Prevents self-rejection

### Deployment

Build and deploy Cloud Functions:
```bash
npm --workspace functions run build && firebase deploy --only functions
```

### Local Development with Emulators

Start Firebase emulators (functions, firestore, storage, ui):
```bash
firebase emulators:start
```

This will start:
- Functions emulator on port 5001
- Firestore emulator on port 8080
- Storage emulator on port 9199
- Emulator UI on port 4000

### Function Testing

Run Cloud Function tests:
```bash
cd functions && npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

If you discover any security vulnerabilities, please see our [Security Policy](SECURITY.md) for reporting instructions.

## 📞 Support

For questions and support, please open an issue in this repository.
