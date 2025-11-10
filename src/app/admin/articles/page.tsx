import { FileText } from "lucide-react";
import { DashboardContainer } from "@/components/dashboard-container";

const ArticlesPage = () => (
  <DashboardContainer
    description="Manage your blog posts and articles"
    icon={FileText}
    title="Articles"
  >
    <div>Articles content goes here</div>
  </DashboardContainer>
);

export default ArticlesPage;
