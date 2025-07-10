import React from "react";

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Support
        </h1>
        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow">
          <iframe
            src="https://tawk.to/chat/686f71548ef240190cec47c5/1ivpl5dk2"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            title="Support Chat"
          />
        </div>
      </div>
    </div>
  );
}
