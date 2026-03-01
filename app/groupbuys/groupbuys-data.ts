export type GroupBuy = {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  targetParticipants: number;
  currentParticipants: number;
  deadline: string;
  notes: string;
  createdAt: string;
};

export type GroupBuyForm = {
  title: string;
  category: string;
  imageUrl: string;
  targetParticipants: string;
  deadline: string;
  notes: string;
};

export const groupBuysStorageKey = "groupbuys-demo";

export const groupBuyCategories = [
  "Anime Goods",
  "Doujin",
  "K-pop",
  "Fan Art",
  "Other",
];

export const initialGroupBuyForm: GroupBuyForm = {
  title: "",
  category: "Anime Goods",
  imageUrl: "",
  targetParticipants: "",
  deadline: "",
  notes: "",
};

export const initialGroupBuys: GroupBuy[] = [
  {
    id: 1,
    title: "Frieren Acrylic Stand Bundle",
    category: "Anime Goods",
    imageUrl: "/Frieren.jpg",
    targetParticipants: 5,
    currentParticipants: 3,
    deadline: "2026-03-10",
    notes: "Ordering from a JP proxy. Bay Area meetup preferred.",
    createdAt: "2026-02-28T09:00:00.000Z",
  },
  {
    id: 2,
    title: "Gintama Doujin Doll",
    category: "Doujin",
    imageUrl: "/Gintama.jpg",
    targetParticipants: 4,
    currentParticipants: 4,
    deadline: "2026-03-05",
    notes: "Already full, waiting for payment confirmation.",
    createdAt: "2026-02-28T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Seventeen Lightstick Bulk Order",
    category: "K-pop",
    imageUrl: "/Seventeen.jpg",
    targetParticipants: 6,
    currentParticipants: 2,
    deadline: "2026-02-20",
    notes: "Deadline passed, closing this round.",
    createdAt: "2026-02-28T11:00:00.000Z",
  },
];

export function getGroupBuyStatus(groupBuy: GroupBuy): "Open" | "Full" | "Closed" {
  const deadline = new Date(`${groupBuy.deadline}T23:59:59`);
  const now = new Date();

  if (deadline.getTime() < now.getTime()) {
    return "Closed";
  }

  if (groupBuy.currentParticipants >= groupBuy.targetParticipants) {
    return "Full";
  }

  return "Open";
}

export function normalizeGroupBuy(
  groupBuy: Partial<GroupBuy> & Pick<GroupBuy, "id">,
): GroupBuy {
  return {
    id: groupBuy.id,
    title: groupBuy.title ?? "",
    category: groupBuy.category ?? "Other",
    imageUrl: groupBuy.imageUrl ?? "",
    targetParticipants: groupBuy.targetParticipants ?? 0,
    currentParticipants: groupBuy.currentParticipants ?? 0,
    deadline: groupBuy.deadline ?? "",
    notes: groupBuy.notes ?? "",
    createdAt: groupBuy.createdAt ?? new Date().toISOString(),
  };
}
