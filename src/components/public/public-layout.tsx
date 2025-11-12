import { trpc } from "@/trpc/server-client";
import { Footer } from "./footer";
import { Header } from "./header";

export const PublicLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const caller = await trpc();
  const categories = await caller.cms.category.getAll();

  return (
    <>
      <Header categories={categories} />
      {children}
      <Footer categories={categories} />
    </>
  );
};
