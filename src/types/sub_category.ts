export interface SubCategoryItem {
    sub_category_id: number;
    parent_category_id: number;
    sub_category_name: string;
    sub_category_slug: string;
}

export interface SubCategoriesApiResponse {
    success: boolean;
    code: number;
    data: SubCategoryItem[] | string;
}