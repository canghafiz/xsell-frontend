export interface CategoryItem {
    category_id: number;
    category_name: string;
    category_slug: string;
    description: string;
    icon: string;
}

export interface CategoriesApiResponse {
    success: boolean;
    code: number;
    data: CategoryItem[];
}