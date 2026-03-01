"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GroupBuy,
  GroupBuyForm,
  groupBuyCategories,
  groupBuysStorageKey,
  initialGroupBuyForm,
  initialGroupBuys,
} from "../groupbuys-data";

export default function NewGroupBuyPage() {
  const router = useRouter();
  const [form, setForm] = useState<GroupBuyForm>(initialGroupBuyForm);
  const [message, setMessage] = useState("");

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

    const targetParticipants = Number(form.targetParticipants);
    const trimmedTitle = form.title.trim();
    const trimmedNotes = form.notes.trim();

    if (
      !trimmedTitle ||
      !form.category ||
      !form.deadline ||
      !trimmedNotes ||
      Number.isNaN(targetParticipants) ||
      targetParticipants < 2
    ) {
      setMessage("Please complete all fields. Target participants must be at least 2.");
      return;
    }

    const nextGroupBuy: GroupBuy = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: trimmedTitle,
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      targetParticipants,
      currentParticipants: 1,
      deadline: form.deadline,
      notes: trimmedNotes,
      createdAt: new Date().toISOString(),
    };

    const savedGroupBuys = window.localStorage.getItem(groupBuysStorageKey);

    let currentGroupBuys = initialGroupBuys;
    if (savedGroupBuys) {
      try {
        const parsedGroupBuys = JSON.parse(savedGroupBuys) as GroupBuy[];
        if (Array.isArray(parsedGroupBuys)) {
          currentGroupBuys = parsedGroupBuys;
        }
      } catch {
        window.localStorage.removeItem(groupBuysStorageKey);
      }
    }

    window.localStorage.setItem(
      groupBuysStorageKey,
      JSON.stringify([nextGroupBuy, ...currentGroupBuys]),
    );

    router.push("/groupbuys");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Group Buy</h1>
          <p className="mt-2 text-sm text-gray-600">
            This form saves to local browser storage for demo purposes.
          </p>
        </div>
        <Link
          href="/groupbuys"
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to List
        </Link>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
              placeholder="Ex: Blue Lock artbook bulk order"
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
              {groupBuyCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Target Participants
            </span>
            <input
              required
              min="2"
              name="targetParticipants"
              type="number"
              value={form.targetParticipants}
              onChange={handleChange}
              placeholder="5"
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
              placeholder="https://example.com/group-buy-image.jpg"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Deadline
            </span>
            <input
              required
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </span>
            <textarea
              required
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={5}
              placeholder="Add shipping, payment, meetup, or proxy details."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>

          {message ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Create Group Buy
          </button>
        </form>
      </section>
    </main>
  );
}
