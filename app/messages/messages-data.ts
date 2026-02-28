export type DemoUserId = "buyer" | "seller" | "manager";

export type MessageThread = {
  id: number;
  postId: number;
  postTitle: string;
  buyerName: string;
  sellerName: string;
  createdAt: string;
};

export type ChatMessage = {
  id: number;
  threadId: number;
  sender: DemoUserId;
  senderName: string;
  body: string;
  createdAt: string;
};

export const messagesStorageKey = "demo-messages";
export const activeThreadStorageKey = "demo-active-thread";
export const activeUserStorageKey = "demo-active-user";

export const demoUsers: Record<DemoUserId, { label: string; name: string }> = {
  buyer: { label: "Buyer View", name: "You" },
  seller: { label: "Seller View", name: "Seller Nancy" },
  manager: { label: "Manager View", name: "Manager" },
};

export type MessagesStore = {
  threads: MessageThread[];
  messages: ChatMessage[];
};

export const initialMessagesStore: MessagesStore = {
  threads: [],
  messages: [],
};
