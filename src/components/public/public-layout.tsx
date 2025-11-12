import { trpc } from "@/trpc/server-client";
import { Footer } from "./footer";
import { Header } from "./header";

export const PublicLayout = async ({ children }: React.PropsWithChildren) => {
  const caller = trpc();
  const categories = await caller.cms.category.getAll();
  return (
    <>
      <Header categories={categories} />
      {children}
      <Footer />
    </>
  );
};
