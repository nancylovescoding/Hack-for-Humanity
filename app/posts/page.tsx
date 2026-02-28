"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

type PostForm = {
  type: PostType;
  status: "Active" | "Sold";
  title: string;
  category: string;
  price: string;
  description: string;
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

const initialForm: PostForm = {
  type: "Selling",
  status: "Active",
  title: "",
  category: "Anime Goods",
  price: "",
  description: "",
};

const categories = ["Anime Goods", "Doujin", "K-pop", "Fan Art", "Other"];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [form, setForm] = useState<PostForm>(initialForm);
  const [message, setMessage] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(storageKey);

    if (!savedPosts) {
      return;
    }

    try {
      const parsedPosts = JSON.parse(savedPosts) as Post[];
      if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
        setPosts(parsedPosts);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(posts));
  }, [posts]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setMessage("");
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingPostId !== null) {
      const updatedPost: Post = {
        id: editingPostId,
        type: form.type,
        status: form.status,
        title: form.title.trim(),
        category: form.category,
        price: form.price.trim(),
        description: form.description.trim(),
        createdAt:
          posts.find((post) => post.id === editingPostId)?.createdAt ??
          new Date().toISOString(),
      };

      if (
        !updatedPost.title ||
        !updatedPost.category ||
        !updatedPost.price ||
        !updatedPost.description
      ) {
        setMessage("Please fill in all required fields.");
        return;
      }

      setPosts((current) =>
        current.map((post) => (post.id === editingPostId ? updatedPost : post)),
      );
      setForm(initialForm);
      setEditingPostId(null);
      setMessage("Post updated on this browser.");
      return;
    }

    const nextPost: Post = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: form.type,
      status: form.status,
      title: form.title.trim(),
      category: form.category,
      price: form.price.trim(),
      description: form.description.trim(),
      createdAt: new Date().toISOString(),
    };

    if (
      !nextPost.title ||
      !nextPost.category ||
      !nextPost.price ||
      !nextPost.description
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setPosts((current) => [nextPost, ...current]);
    setForm(initialForm);
    setMessage("Post published on this browser.");
  }

  function handleEditPost(post: Post) {
    setForm({
      type: post.type,
      status: post.status,
      title: post.title,
      category: post.category,
      price: post.price,
      description: post.description,
    });
    setEditingPostId(post.id);
    setMessage("Editing selected post.");
  }

  function handleDeletePost(postId: number) {
    setPosts((current) => current.filter((post) => post.id !== postId));
    if (editingPostId === postId) {
      setForm(initialForm);
      setEditingPostId(null);
    }
    setMessage("Post deleted from this browser.");
  }

  function handleCancelEdit() {
    setForm(initialForm);
    setEditingPostId(null);
    setMessage("Edit cancelled.");
  }

  function handleResetPosts() {
    setPosts(initialPosts);
    window.localStorage.removeItem(storageKey);
    setEditingPostId(null);
    setMessage("Posts reset to the starter list.");
  }

  function formatCreatedAt(value: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }
  return (
    <main className="mx-auto min-h-screen max-w-3xl gap-10 px-6 py-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingPostId !== null ? "Edit Post" : "Create a Post"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Start with the basic listing fields. Posts stay in your browser after
                refresh.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdminMode((current) => !current)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                isAdminMode
                  ? "bg-black text-white hover:bg-gray-800"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isAdminMode ? "Admin Mode On" : "Admin Mode Off"}
            </button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Post Type
            </span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
            >
              <option value="Selling">Selling</option>
              <option value="Looking For">Looking For</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
            >
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </span>
            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Haikyuu keychain set"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </span>
            <input
              required
              min="0"
              step="0.01"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="18.00"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </span>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Add condition, meetup/shipping details, and anything the buyer should know."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          {message ? (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              {editingPostId !== null ? "Save Changes" : "Publish Post"}
            </button>
            {editingPostId !== null ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleResetPosts}
              className="rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
