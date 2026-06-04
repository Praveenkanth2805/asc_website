import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />

          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-black">
            <Image
              src="/logo.png"
              alt="ASC Logo"
              width={56}
              height={56}
            />
          </div>
        </div>

        <p className="mt-4 text-gold-500 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}