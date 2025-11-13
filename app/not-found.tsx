import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page or item you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
