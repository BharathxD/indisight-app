import { Users } from "lucide-react";
import { DashboardContainer } from "@/components/dashboard-container";

const AuthorsPage = () => (
  <DashboardContainer
    description="Manage content contributors and authors"
    icon={Users}
    title="Authors"
  >
    <div>Authors content goes here</div>
  </DashboardContainer>
);

export default AuthorsPage;
