export default function Home() {
  return (
    <main
      className="-mt-24 flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 pt-24"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
          Fandom Hub
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose a section from the navigation above.
        </p>
      </div>
    </main>
  );
}
