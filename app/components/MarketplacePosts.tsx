"use client";

import { useEffect, useState } from "react";

type PostType = "Selling" | "Looking For";

type Post = {
  id: number;
  type: PostType;
  status: "Active" | "Sold";
  title: string;
  category: string;
  price: string;
  description: string;
  createdAt: string;
};

type TypeFilter = "All" | PostType;
type StatusFilter = "All" | "Active" | "Sold";

const storageKey = "marketplace-posts";

const initialPosts: Post[] = [
  {
    id: 1,
    type: "Selling",
    status: "Active",
    title: "Jujutsu Kaisen Acrylic Stand",
    category: "Anime Goods",
    price: "18",
    description: "Like-new acrylic stand from a convention booth.",
    createdAt: "2026-02-28T09:00:00.000Z",
  },
  {
    id: 2,
    type: "Looking For",
    status: "Active",
    title: "Original Doujinshi Artbook",
    category: "Doujin",
    price: "25",
    description: "Looking for a clean copy with local meetup preferred.",
    createdAt: "2026-02-28T10:00:00.000Z",
  },
];

export default function MarketplacePosts() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Post[];
      if (Array.isArray(parsed) && parsed.length > 0) setPosts(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(posts));
  }, [posts]);

  function formatCreatedAt(value: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }

  const filteredPosts = posts.filter((post) => {
    const matchesType = typeFilter === "All" || post.type === typeFilter;
    const matchesStatus = statusFilter === "All" || post.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Marketplace Posts</h2>
          <p className="mt-2 text-sm text-gray-600">Filter by post type and status.</p>
        </div>
        <p className="text-sm text-gray-600">{posts.length} total posts</p>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Filter by Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
          >
            <option value="All">All Types</option>
            <option value="Selling">Selling</option>
            <option value="Looking For">Looking For</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Filter by Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Sold">Sold</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">{post.type}</span>
                  <span
                    className={`mb-2 ml-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      post.status === "Sold" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {post.status}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.category}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">${post.price}</span>
              </div>

              <p className="text-sm leading-6 text-gray-600">{post.description}</p>

              <p className="text-xs text-gray-400">Posted {formatCreatedAt(post.createdAt)}</p>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">No posts match the current filters.</p>
      ) : null}
    </section>
  );
}
