"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  initialPostForm,
  initialPosts,
  normalizePost,
  Post,
  PostForm,
  postsStorageKey,
  PostType,
  postCategories,
} from "./posts-data";

type TypeFilter = "All" | PostType;
type StatusFilter = "All" | "Active" | "Sold";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [form, setForm] = useState<PostForm>(initialPostForm);
  const [message, setMessage] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [hasLoadedPosts, setHasLoadedPosts] = useState(false);

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(postsStorageKey);

    if (!savedPosts) {
      setHasLoadedPosts(true);
      return;
    }

    try {
      const parsedPosts = (JSON.parse(savedPosts) as Array<Partial<Post> & Pick<Post, "id">>)
        .map(normalizePost);
      if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
        setPosts(parsedPosts);
      }
    } catch {
      window.localStorage.removeItem(postsStorageKey);
    } finally {
      setHasLoadedPosts(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedPosts) {
      return;
    }

    window.localStorage.setItem(postsStorageKey, JSON.stringify(posts));
  }, [posts, hasLoadedPosts]);

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
        imageUrl: form.imageUrl.trim(),
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
      setForm(initialPostForm);
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
      imageUrl: form.imageUrl.trim(),
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
    setForm(initialPostForm);
    setMessage("Post published on this browser.");
  }

  function handleEditPost(post: Post) {
    setForm({
      type: post.type,
      status: post.status,
      title: post.title,
      category: post.category,
      price: post.price,
      imageUrl: post.imageUrl,
      description: post.description,
    });
    setEditingPostId(post.id);
    setMessage("Editing selected post.");
  }

  function handleDeletePost(postId: number) {
    setPosts((current) => current.filter((post) => post.id !== postId));
    if (editingPostId === postId) {
      setForm(initialPostForm);
      setEditingPostId(null);
    }
    setMessage("Post deleted from this browser.");
  }

  function handleCancelEdit() {
    setForm(initialPostForm);
    setEditingPostId(null);
    setMessage("Edit cancelled.");
  }

  function handleResetPosts() {
    setPosts(initialPosts);
    window.localStorage.removeItem(postsStorageKey);
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

  const filteredPosts = posts.filter((post) => {
    const matchesType = typeFilter === "All" || post.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || post.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[380px_minmax(0,1fr)]">
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
              {postCategories.map((category) => (
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
              Image URL
            </span>
            <input
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
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

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Marketplace Posts</h2>
            <p className="mt-2 text-sm text-gray-600">
              Filter by post type and status.
            </p>
          </div>
          <p className="text-sm text-gray-600">{posts.length} total posts</p>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Filter by Type
            </span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
            >
              <option value="All">All Types</option>
              <option value="Selling">Selling</option>
              <option value="Looking For">Looking For</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Filter by Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
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
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-52 bg-gray-100">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No image provided
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                      {post.type}
                    </span>
                    <span
                      className={`mb-2 ml-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        post.status === "Sold"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {post.status}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500">{post.category}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">
                    ${post.price}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {post.description}
                </p>

                <p className="text-xs text-gray-400">
                  Posted {formatCreatedAt(post.createdAt)}
                </p>

                {isAdminMode ? (
                  <div className="flex gap-3 pt-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEditPost(post)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/posts/${post.id}`}
                    className="inline-block rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
            No posts match the current filters.
          </p>
        ) : null}
      </section>
    </main>
  );
}
