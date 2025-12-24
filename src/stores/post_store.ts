import { create } from "zustand";
import { MapItem } from "@/types/map";
import { ProductDetailItem } from "@/types/product";

export type MyAdsSortType =
    | "new_to_oldest"
    | "oldest_to_new"
    | "most_liked";

interface PostStore {
    category: string;
    location: MapItem | null;
    sortMyAd: MyAdsSortType;

    product: ProductDetailItem | null;

    setCategory: (category: string) => void;
    setLocation: (location: MapItem | null) => void;
    setSortMyAd: (sortMyAd: MyAdsSortType) => void;

    setProduct: (product: ProductDetailItem) => void;
    clearProduct: () => void;
    resetPost: () => void;
}

const initialState = {
    category: "",
    location: null,
    sortMyAd: "new_to_oldest" as MyAdsSortType,
    product: null,
};

export const usePostStore = create<PostStore>((set) => ({
    ...initialState,
    setCategory: (category) => set({ category }),
    setLocation: (location) => set({ location }),
    setSortMyAd: (sortMyAd) => set({ sortMyAd }),
    setProduct: (product) => set({ product }),
    clearProduct: () => set({ product: null }),

    resetPost: () => set(initialState),
}));
