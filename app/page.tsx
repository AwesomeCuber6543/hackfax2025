import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">Emergency Response System</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Voice agent for emergency services during natural disasters
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/dashboard"
          >
            View Emergency Dashboard
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="https://github.com/yourusername/emergency-response-system"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">About This Project</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This application serves as a voice agent that takes calls for emergency services during natural disasters.
            It automatically prioritizes and saves emergency information in a database for first responders to access.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Built for the hackathon to improve emergency response times and resource allocation during crisis situations.
          </p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2023 Emergency Response System
        </p>
      </footer>
    </div>
  );
}
