"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GroupBuy,
  getGroupBuyStatus,
  groupBuysStorageKey,
  initialGroupBuys,
} from "./groupbuys-data";

export default function GroupBuysPage() {
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>(initialGroupBuys);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedGroupBuys = window.localStorage.getItem(groupBuysStorageKey);

    if (!savedGroupBuys) {
      return;
    }

    try {
      const parsedGroupBuys = JSON.parse(savedGroupBuys) as GroupBuy[];
      if (Array.isArray(parsedGroupBuys) && parsedGroupBuys.length > 0) {
        setGroupBuys(parsedGroupBuys);
      }
    } catch {
      window.localStorage.removeItem(groupBuysStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(groupBuysStorageKey, JSON.stringify(groupBuys));
  }, [groupBuys]);

  function handleJoin(groupBuyId: number) {
    let updated = false;

    setGroupBuys((current) =>
      current.map((groupBuy) => {
        if (groupBuy.id !== groupBuyId) {
          return groupBuy;
        }

        const status = getGroupBuyStatus(groupBuy);
        if (status !== "Open") {
          return groupBuy;
        }

        updated = true;
        return {
          ...groupBuy,
          currentParticipants: groupBuy.currentParticipants + 1,
        };
      }),
    );

    setMessage(updated ? "Joined group buy on this browser." : "This group buy is not open.");
  }

  function handleReset() {
    setGroupBuys(initialGroupBuys);
    window.localStorage.removeItem(groupBuysStorageKey);
    setMessage("Group buys reset to starter data.");
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Group Buys</h1>
          <p className="mt-2 text-sm text-gray-600">
            Demo flow: create a listing, then use Join to increment participants in
            local browser storage.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/groupbuys/new"
            className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Create Group Buy
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {message ? (
        <p className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      ) : null}

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        {groupBuys.length} group buys saved in this browser
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groupBuys.map((groupBuy) => {
          const status = getGroupBuyStatus(groupBuy);

          return (
            <article
              key={groupBuy.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    {groupBuy.category}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {groupBuy.title}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    status === "Open"
                      ? "bg-green-100 text-green-700"
                      : status === "Full"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Participants: {groupBuy.currentParticipants}/{groupBuy.targetParticipants}
                </p>
                <p>Deadline: {formatDate(groupBuy.deadline)}</p>
                <p>{groupBuy.notes}</p>
              </div>

              <button
                type="button"
                onClick={() => handleJoin(groupBuy.id)}
                disabled={status !== "Open"}
                className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  status === "Open"
                    ? "bg-black text-white hover:bg-gray-800"
                    : "cursor-not-allowed bg-gray-200 text-gray-500"
                }`}
              >
                {status === "Open" ? "Join" : status === "Full" ? "Full" : "Closed"}
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
}
