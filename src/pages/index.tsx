export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to SkateHubba
      </h1>
      <a
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        href="/challenges"
      >
        Go to Challenges
      </a>
    </div>
  );
}