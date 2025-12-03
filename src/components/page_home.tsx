// PageHome.tsx
import pageService from "@/services/page_service";

export default async function PageHome() {
    const params = {
        newly_listed: 1,
        trending: 1,
        like_new_items: 2,
        good_condition: 2,
        used_electronics: 2,
        home_items: 2,
        fashion_items: 2,
        editor_pick: 1,
    };

    const pages = await pageService.getPage("home", params); // hanya "home" sebagai slug
    console.log(pages.data?.data);

    return <></>;
}