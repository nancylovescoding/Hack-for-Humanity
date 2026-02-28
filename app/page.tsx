import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Hack for Humanity</h1>
      <p className="mt-2 text-gray-600">Choose a section:</p>

      <div className="mt-6 flex gap-3 flex-wrap">
        <Link
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          href="/posts"
        >
          Marketplace Posts
        </Link>
        <Link
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          href="/groupbuys"
        >
          Group Buys
        </Link>
        <Link
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          href="/profile"
        >
          Profile
        </Link>
      </div>
    </main>
  );
}
