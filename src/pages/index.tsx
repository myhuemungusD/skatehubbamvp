import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to SkateHubba
      </h1>
      <div className="space-y-4">
        <Link
          className="block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-center"
          href="/challenges"
        >
          Go to Challenges
        </Link>
        <Link
          className="block px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 text-center"
          href="/leaderboard"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}