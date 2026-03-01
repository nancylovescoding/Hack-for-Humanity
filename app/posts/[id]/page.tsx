"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  activeUserStorageKey,
} from "../../messages/messages-data";
import { initialPosts, normalizePost, Post, postsStorageKey } from "../posts-data";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(postsStorageKey);
    let currentPosts = initialPosts;

    if (savedPosts) {
      try {
        currentPosts = (
          JSON.parse(savedPosts) as Array<Partial<Post> & Pick<Post, "id">>
        ).map(normalizePost);
      } catch {
        window.localStorage.removeItem(postsStorageKey);
      }
    }

    const foundPost = currentPosts.find((item) => String(item.id) === params.id);
    setPost(foundPost ?? null);
  }, [params.id]);

  function handleMessageSeller() {
    if (!post) {
      return;
    }
    window.localStorage.setItem(activeUserStorageKey, "buyer");
    router.push(
      `/messages?postId=${encodeURIComponent(String(post.id))}&postTitle=${encodeURIComponent(post.title)}`,
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-8">
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
          Post not found in this browser. Go back to the posts list and create or
          select a listing first.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Basic transaction detail page for the messaging demo.
          </p>
        </div>
        <Link
          href="/posts"
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to Posts
        </Link>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative mb-6 h-80 overflow-hidden rounded-2xl bg-gray-100">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No image provided
            </div>
          )}
        </div>

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                {post.type}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  post.status === "Sold"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{post.category}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-lg font-semibold text-gray-900">
            ${post.price}
          </span>
        </div>

        <p className="mb-6 text-sm leading-7 text-gray-600">{post.description}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleMessageSeller}
            className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Message Seller
          </button>
          <Link
            href="/messages"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Open Messages
          </Link>
        </div>
      </section>
    </main>
  );
}
