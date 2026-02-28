"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { groupBuysStorageKey, initialGroupBuys } from "../groupbuys/groupbuys-data";

type ProfileData = {
  displayName: string;
  handle: string;
  location: string;
  bio: string;
};

type DemoPost = {
  id: number;
  title: string;
  status: "Active" | "Sold";
  type: "Selling" | "Looking For";
  createdAt: string;
};

type DemoGroupBuy = {
  id: number;
  title: string;
  currentParticipants: number;
  targetParticipants: number;
  deadline: string;
  createdAt: string;
};

const profileStorageKey = "demo-profile";
const postsStorageKey = "marketplace-posts";

const initialProfile: ProfileData = {
  displayName: "Nancy",
  handle: "@fandomcollector",
  location: "San Francisco, CA",
  bio: "Collector of anime goods, group-buy organizer, and occasional proxy helper.",
};

const fallbackPosts: DemoPost[] = [
  {
    id: 1,
    title: "Jujutsu Kaisen Acrylic Stand",
    status: "Active",
    type: "Selling",
    createdAt: "2026-02-28T09:00:00.000Z",
  },
  {
    id: 2,
    title: "Original Doujinshi Artbook",
    status: "Active",
    type: "Looking For",
    createdAt: "2026-02-28T10:00:00.000Z",
  },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [posts, setPosts] = useState<DemoPost[]>(fallbackPosts);
  const [groupBuys, setGroupBuys] = useState<DemoGroupBuy[]>(initialGroupBuys);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(profileStorageKey);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile) as ProfileData);
      } catch {
        window.localStorage.removeItem(profileStorageKey);
      }
    }

    const savedPosts = window.localStorage.getItem(postsStorageKey);
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts) as DemoPost[];
        if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
          setPosts(parsedPosts);
        }
      } catch {
        window.localStorage.removeItem(postsStorageKey);
      }
    }

    const savedGroupBuys = window.localStorage.getItem(groupBuysStorageKey);
    if (savedGroupBuys) {
      try {
        const parsedGroupBuys = JSON.parse(savedGroupBuys) as DemoGroupBuy[];
        if (Array.isArray(parsedGroupBuys) && parsedGroupBuys.length > 0) {
          setGroupBuys(parsedGroupBuys);
        }
      } catch {
        window.localStorage.removeItem(groupBuysStorageKey);
      }
    }
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setMessage("");
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedProfile = {
      displayName: profile.displayName.trim(),
      handle: profile.handle.trim(),
      location: profile.location.trim(),
      bio: profile.bio.trim(),
    };

    setProfile(trimmedProfile);
    window.localStorage.setItem(profileStorageKey, JSON.stringify(trimmedProfile));
    setMessage("Profile saved in this browser.");
  }

  const activePosts = posts.filter((post) => post.status === "Active").length;
  const soldPosts = posts.filter((post) => post.status === "Sold").length;
  const openGroupBuys = groupBuys.filter(
    (groupBuy) => new Date(`${groupBuy.deadline}T23:59:59`).getTime() >= Date.now(),
  ).length;
  const joinedPeople = groupBuys.reduce(
    (total, groupBuy) => total + groupBuy.currentParticipants,
    0,
  );

  const recentPosts = [...posts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const recentGroupBuys = [...groupBuys]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Simple demo profile with local browser save, activity summary, and rating
          placeholders.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {profile.displayName}
              </h2>
              <p className="text-sm text-gray-500">{profile.handle}</p>
              <p className="text-sm text-gray-500">{profile.location}</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">Community Rating</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">4.8 / 5.0</p>
            <p className="mt-1 text-sm text-amber-500">★★★★★</p>
            <p className="mt-2 text-sm text-gray-500">
              Placeholder for buyer/seller feedback and trust score.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSave}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Display Name
              </span>
              <input
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Handle
              </span>
              <input
                name="handle"
                value={profile.handle}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </span>
              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Bio
              </span>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </label>

            {message ? (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Save Profile
            </button>
          </form>
        </section>

        <section className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {posts.length}
              </p>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {activePosts}
              </p>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Sold / Completed</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {soldPosts}
              </p>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Open Group Buys</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {openGroupBuys}
              </p>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Recent Posts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Pulled from your local marketplace demo data.
                </p>
              </div>

              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.type}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === "Sold"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Group Buy Activity
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Lightweight summary for demo purposes only.
                </p>
              </div>

              <div className="mb-4 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Participants Across Buys</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {joinedPeople}
                </p>
              </div>

              <div className="space-y-3">
                {recentGroupBuys.map((groupBuy) => (
                  <article
                    key={groupBuy.id}
                    className="rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <p className="font-medium text-gray-900">{groupBuy.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {groupBuy.currentParticipants}/{groupBuy.targetParticipants} participants
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Ratings Placeholder
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Seller Rating</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">4.9</p>
                <p className="mt-1 text-sm text-gray-500">Based on 12 demo reviews</p>
              </article>
              <article className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Buyer Rating</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">4.7</p>
                <p className="mt-1 text-sm text-gray-500">Based on 8 demo reviews</p>
              </article>
              <article className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">~2 hrs</p>
                <p className="mt-1 text-sm text-gray-500">Placeholder metric only</p>
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
