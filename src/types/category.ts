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

export interface SubCategoryItem {
    sub_category_id: number;
    sub_category_name: string;
    slug: string;
    icon: string;
    category: CategoryItem;
}

export interface CategoryWithSubCategory {
    category_id: number;
    category_name: string;
    category_slug: string;
    description: string;
    icon: string;
    sub_categories: WithSubCategoryItem[];
}

export interface WithSubCategoryItem {
    sub_category_id: number;
    sub_category_name: string;
    sub_category_slug: string;
    parent_category_id: number;
}

export interface CategoryWithSubCategoryApiResponse {
    success: boolean;
    code: number;
    data: CategoryWithSubCategory[];
}