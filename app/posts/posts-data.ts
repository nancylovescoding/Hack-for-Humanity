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
    title: "Enhypen album",
    category: "K-pop",
    price: "18",
    imageUrl:
      "/album.jpg",
    description: "Selling second hand Enhypen album.",
    createdAt: "2026-02-28T09:00:00.000Z",
  },
  {
    id: 2,
    type: "Selling",
    status: "Active",
    title: "Demon Slayer set",
    category: "Anime Goods",
    price: "25",
    imageUrl:
      "/demon_slayer.jpg",
    description: "Completely new demon slayer set includes: badges & coloured paper.",
    createdAt: "2026-02-28T10:00:00.000Z",
  },
  {
    id: 3,
    type: "Looking For",
    status: "Active",
    title: "Harry Potter EVERGREEN Doujin Book",
    category: "Doujin",
    price: "25",
    imageUrl:
      "/harry_potter.jpg",
    description: "Looking for a clean copy.",
    createdAt: "2026-02-28T10:00:00.000Z",
  }
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
