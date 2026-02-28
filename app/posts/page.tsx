export default function PostsPage() {
  const mockPosts = [
    {
      id: 1,
      title: "Jujutsu Kaisen Acrylic Stand",
      price: "$18",
      category: "Anime Goods",
      condition: "Like New",
    },
    {
      id: 2,
      title: "K-pop Photocard (Stray Kids)",
      price: "$12",
      category: "K-pop",
      condition: "New",
    },
    {
      id: 3,
      title: "Original Doujinshi Artbook",
      price: "$25",
      category: "Doujin",
      condition: "Used",
    },
  ];

  return (
    <main className="p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Posts</h1>
          <p className="text-gray-600 mt-2">
            Buy, sell, and trade anime goods, doujin items, and fan merchandise.
          </p>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          + Create Post
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Anime Goods", "Doujin", "K-pop", "Fan Art"].map(
          (category) => (
            <button
              key={category}
              className="px-4 py-1 border rounded-full text-sm hover:bg-gray-100 transition"
            >
              {category}
            </button>
          ),
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockPosts.map((post) => (
          <div
            key={post.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
              Image Placeholder
            </div>

            <h2 className="font-semibold text-lg">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.category}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="font-bold">{post.price}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {post.condition}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
