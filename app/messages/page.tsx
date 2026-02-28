"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  activeThreadStorageKey,
  activeUserStorageKey,
  ChatMessage,
  demoUsers,
  DemoUserId,
  initialMessagesStore,
  MessageThread,
  messagesStorageKey,
  MessagesStore,
} from "./messages-data";

function getInitialStore(): MessagesStore {
  const savedStore = window.localStorage.getItem(messagesStorageKey);
  if (!savedStore) {
    return initialMessagesStore;
  }

  try {
    return JSON.parse(savedStore) as MessagesStore;
  } catch {
    window.localStorage.removeItem(messagesStorageKey);
    return initialMessagesStore;
  }
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [store, setStore] = useState<MessagesStore>(initialMessagesStore);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<DemoUserId>("buyer");
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const nextStore = getInitialStore();
    setStore(nextStore);

    const savedThreadId = window.localStorage.getItem(activeThreadStorageKey);
    if (savedThreadId) {
      setActiveThreadId(Number(savedThreadId));
    } else if (nextStore.threads[0]) {
      setActiveThreadId(nextStore.threads[0].id);
    }

    const savedUser = window.localStorage.getItem(activeUserStorageKey) as DemoUserId | null;
    if (savedUser && savedUser in demoUsers) {
      setActiveUser(savedUser);
    }
  }, []);

  useEffect(() => {
    const postIdParam = searchParams.get("postId");
    const postTitleParam = searchParams.get("postTitle");

    if (!postIdParam || !postTitleParam) {
      return;
    }

    const postId = Number(postIdParam);
    if (Number.isNaN(postId)) {
      return;
    }

    setStore((current) => {
      const existingThread = current.threads.find((thread) => thread.postId === postId);

      if (existingThread) {
        setActiveThreadId(existingThread.id);
        return current;
      }

      const nextThread: MessageThread = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        postId,
        postTitle: postTitleParam,
        buyerName: demoUsers.buyer.name,
        sellerName: demoUsers.seller.name,
        createdAt: new Date().toISOString(),
      };

      setActiveThreadId(nextThread.id);
      return {
        ...current,
        threads: [nextThread, ...current.threads],
      };
    });
  }, [searchParams]);

  useEffect(() => {
    window.localStorage.setItem(messagesStorageKey, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (activeThreadId !== null) {
      window.localStorage.setItem(activeThreadStorageKey, String(activeThreadId));
    }
  }, [activeThreadId]);

  useEffect(() => {
    window.localStorage.setItem(activeUserStorageKey, activeUser);
  }, [activeUser]);

  const visibleThreads = useMemo(() => {
    if (activeUser === "manager") {
      return store.threads;
    }

    return store.threads.filter((thread) =>
      activeUser === "buyer"
        ? thread.buyerName === demoUsers.buyer.name
        : thread.sellerName === demoUsers.seller.name,
    );
  }, [store.threads, activeUser]);

  const activeThread = useMemo(
    () =>
      visibleThreads.find((thread) => thread.id === activeThreadId) ??
      visibleThreads[0] ??
      null,
    [visibleThreads, activeThreadId],
  );

  useEffect(() => {
    if (visibleThreads.length === 0) {
      setActiveThreadId(null);
      return;
    }

    const threadStillVisible = visibleThreads.some(
      (thread) => thread.id === activeThreadId,
    );

    if (!threadStillVisible) {
      setActiveThreadId(visibleThreads[0].id);
    }
  }, [visibleThreads, activeThreadId]);

  const activeMessages = useMemo(() => {
    if (!activeThread) {
      return [];
    }

    return store.messages
      .filter((chatMessage) => chatMessage.threadId === activeThread.id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [store.messages, activeThread]);

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeThread || !draft.trim() || activeUser === "manager") {
      return;
    }

    const nextMessage: ChatMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      threadId: activeThread.id,
      sender: activeUser,
      senderName: demoUsers[activeUser].name,
      body: draft.trim(),
      createdAt: new Date().toISOString(),
    };

    setStore((current) => ({
      ...current,
      messages: [...current.messages, nextMessage],
    }));
    setDraft("");
    setMessage("Message saved in this browser.");
  }

  function handleSeedReply() {
    if (!activeThread || activeUser === "manager") {
      return;
    }

    const replySender: DemoUserId = activeUser === "buyer" ? "seller" : "buyer";
    const replyMessage: ChatMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      threadId: activeThread.id,
      sender: replySender,
      senderName: demoUsers[replySender].name,
      body:
        replySender === "seller"
          ? "Still available. We can coordinate payment and pickup."
          : "Sounds good. I can meet this weekend.",
      createdAt: new Date().toISOString(),
    };

    setStore((current) => ({
      ...current,
      messages: [...current.messages, replyMessage],
    }));
    setMessage("Added a demo reply for presentation flow.");
  }

  function handleSelectThread(thread: MessageThread) {
    setActiveThreadId(thread.id);
    setDraft("");
    setMessage("");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Demo private messaging for transactions. On one computer, switch roles
            to simulate buyer, seller, or manager.
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={activeUser}
            onChange={(event) => setActiveUser(event.target.value as DemoUserId)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-black"
          >
            <option value="buyer">{demoUsers.buyer.label}</option>
            <option value="seller">{demoUsers.seller.label}</option>
            <option value="manager">{demoUsers.manager.label}</option>
          </select>

          <Link
            href="/posts"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Posts
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeUser === "manager" ? "All Conversations" : "Your Conversations"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {visibleThreads.length} threads in this browser
            </p>
          </div>

          <div className="space-y-3">
            {visibleThreads.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                No conversations yet. Open a post detail page and click `Message Seller`.
              </p>
            ) : null}

            {visibleThreads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => handleSelectThread(thread)}
                className={`block w-full rounded-xl border px-4 py-3 text-left transition ${
                  activeThreadId === thread.id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p className="font-medium text-gray-900">{thread.postTitle}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Buyer: {thread.buyerName}
                </p>
                <p className="text-sm text-gray-500">Seller: {thread.sellerName}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {!activeThread ? (
            <p className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
              Select a conversation to view messages. If you came from a post
              detail page, the newest conversation should appear in the left
              panel automatically.
            </p>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-3 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeThread.postTitle}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Buyer: {activeThread.buyerName} | Seller: {activeThread.sellerName}
                  </p>
                </div>

                {activeUser !== "manager" ? (
                  <button
                    type="button"
                    onClick={handleSeedReply}
                    className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Add Demo Reply
                  </button>
                ) : null}
              </div>

              <div className="mb-6 space-y-3">
                {activeMessages.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    No messages yet. Start the conversation below.
                  </p>
                ) : null}

                {activeMessages.map((chatMessage) => (
                  <article
                    key={chatMessage.id}
                    className={`max-w-xl rounded-2xl px-4 py-3 ${
                      chatMessage.sender === "buyer"
                        ? "bg-gray-100 text-gray-900"
                        : chatMessage.sender === "seller"
                          ? "ml-auto bg-black text-white"
                          : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
                      {chatMessage.senderName}
                    </p>
                    <p className="text-sm leading-6">{chatMessage.body}</p>
                  </article>
                ))}
              </div>

              {message ? (
                <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </p>
              ) : null}

              {activeUser === "manager" ? (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Manager view is read-only and can inspect all conversations.
                </p>
              ) : (
                <form className="space-y-3" onSubmit={handleSendMessage}>
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={4}
                    placeholder={
                      activeUser === "buyer"
                        ? "Ask about availability, price, pickup, or shipping."
                        : "Reply to the buyer about the transaction."
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
