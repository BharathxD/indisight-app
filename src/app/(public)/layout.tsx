import { PublicLayout } from "@/components/public/public-layout";

const PublicPagesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => <PublicLayout>{children}</PublicLayout>;

export default PublicPagesLayout;
