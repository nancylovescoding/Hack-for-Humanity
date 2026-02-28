"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Post = {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
};

type PostForm = Omit<Post, "id">;

const initialPosts: Post[] = [
  {
    id: 1,
    title: "Jujutsu Kaisen Acrylic Stand",
    category: "Anime Goods",
    price: "18",
    image: "",
    description: "Like-new acrylic stand from a convention booth.",
  },
  {
    id: 2,
    title: "K-pop Photocard (Stray Kids)",
    category: "K-pop",
    price: "12",
    image: "",
    description: "Official photocard in protective sleeve.",
  },
];

const initialForm: PostForm = {
  title: "",
  category: "Anime Goods",
  price: "",
  image: "",
  description: "",
};

const categories = ["Anime Goods", "Doujin", "K-pop", "Fan Art", "Other"];

export default function PostsPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState(initialForm);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextPost: Post = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      price: form.price.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    if (
      !nextPost.title ||
      !nextPost.category ||
      !nextPost.price ||
      !nextPost.description
    ) {
      return;
    }

    setPosts((current) => [nextPost, ...current]);
    setForm(initialForm);
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create a Post</h1>
          <p className="mt-2 text-sm text-gray-600">
            Start with the core listing fields. This version stores posts only in
            local page state.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              Image URL
            </span>
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/item.jpg"
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

          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Publish Post
          </button>
        </form>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Marketplace Posts</h2>
          <p className="mt-2 text-sm text-gray-600">
            New posts appear immediately after submission.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-gray-500">
                {post.image ? (
                  // Using a plain img avoids extra Next image config for remote URLs at this stage.
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "No image provided"
                )}
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
