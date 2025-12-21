import { create } from 'zustand';
import { MapItem } from '@/types/map';

export type MyAdsSortType =
    | "new_to_oldest"
    | "oldest_to_new"
    | "most_liked";

interface PostStore {
    // Post data
    title: string;
    description: string;
    images: File[];
    location: MapItem | null;
    category: string;
    tags: string[];
    price: number | null;
    sortMyAd: MyAdsSortType;

    // Actions
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setImages: (images: File[]) => void;
    addImage: (image: File) => void;
    removeImage: (index: number) => void;
    setLocation: (location: MapItem) => void;
    clearLocation: () => void;
    setCategory: (category: string) => void;
    setTags: (tags: string[]) => void;
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    setPrice: (price: number | null) => void;

    // ✅ FIXED
    setSortMyAd: (sortMyAd: MyAdsSortType) => void;

    resetPost: () => void;
}

const initialState: Pick<
    PostStore,
    | "title"
    | "description"
    | "images"
    | "location"
    | "category"
    | "tags"
    | "price"
    | "sortMyAd"
> = {
    title: '',
    description: '',
    images: [],
    location: null,
    category: '',
    tags: [],
    price: null,
    sortMyAd: "new_to_oldest",
};

export const usePostStore = create<PostStore>((set) => ({
    ...initialState,

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setImages: (images) => set({ images }),

    addImage: (image) =>
        set((state) => ({
            images: [...state.images, image],
        })),

    removeImage: (index) =>
        set((state) => ({
            images: state.images.filter((_, i) => i !== index),
        })),

    setLocation: (location) => set({ location }),
    clearLocation: () => set({ location: null }),
    setCategory: (category) => set({ category }),
    setTags: (tags) => set({ tags }),

    addTag: (tag) =>
        set((state) =>
            state.tags.includes(tag)
                ? state
                : { tags: [...state.tags, tag] }
        ),

    removeTag: (tag) =>
        set((state) => ({
            tags: state.tags.filter((t) => t !== tag),
        })),

    setPrice: (price) => set({ price }),

    setSortMyAd: (sortMyAd) => set({ sortMyAd }),

    resetPost: () => set(initialState),
}));
