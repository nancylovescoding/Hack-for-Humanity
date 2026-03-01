export type PostType = "Selling" | "Looking For";
export type PostStatus = "Active" | "Sold";

export type Post = {
  id: number;
  type: PostType;
  status: PostStatus;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
  createdAt: string;
};

export type PostForm = {
  type: PostType;
  status: PostStatus;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
};

export const postsStorageKey = "marketplace-posts";

export const initialPosts: Post[] = [
  {
    id: 1,
    type: "Selling",
    status: "Active",
    title: "Jujutsu Kaisen Acrylic Stand",
    category: "Anime Goods",
    price: "18",
    imageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80",
    description: "Looking for a clean copy with local meetup preferred.",
    createdAt: "2026-02-28T10:00:00.000Z",
  },
];

export const initialPostForm: PostForm = {
  type: "Selling",
  status: "Active",
  title: "",
  category: "Anime Goods",
  price: "",
  imageUrl: "",
  description: "",
};

export const postCategories = [
  "Anime Goods",
  "Doujin",
  "K-pop",
  "Fan Art",
  "Other",
];

export function normalizePost(post: Partial<Post> & Pick<Post, "id">): Post {
  return {
    id: post.id,
    type: post.type ?? "Selling",
    status: post.status ?? "Active",
    title: post.title ?? "",
    category: post.category ?? "Other",
    price: post.price ?? "",
    imageUrl: post.imageUrl ?? "",
    description: post.description ?? "",
    createdAt: post.createdAt ?? new Date().toISOString(),
  };
}
