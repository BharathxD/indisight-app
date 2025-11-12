import { FileText } from "lucide-react";
import { ArticleForm } from "@/components/admin/articles/article-form";
import { DashboardContainer } from "@/components/dashboard-container";

const NewArticlePage = () => (
  <DashboardContainer
    description="Create a new blog post or article"
    icon={FileText}
    title="Create Article"
  >
    <ArticleForm mode="create" />
  </DashboardContainer>
);

export default NewArticlePage;
