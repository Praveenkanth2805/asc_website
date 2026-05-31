"use client";
export default function TestPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <button
        onClick={() => alert("Button works!")}
        className="bg-yellow-500 text-black px-8 py-4 rounded text-xl"
      >
        TAP ME
      </button>
    </div>
  );
}