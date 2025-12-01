import HomePage from "@/app/home/page";
import metaHelper from "@/helpers/meta";
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metaHelper.generatePageMetadata("home");
}

export default function Home() {
  return <>
    <HomePage/>
  </>;
}
