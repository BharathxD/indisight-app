import Link from "next/link";
import { siteConfig } from "@/lib/config";

const Home = () => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    {siteConfig.name}
    <Link href="/admin">Admin</Link>
  </div>
);

export default Home;
