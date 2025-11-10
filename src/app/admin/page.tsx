import { LayoutDashboard } from "lucide-react";
import { DashboardContainer } from "@/components/dashboard-container";

const AdminPage = () => (
  <DashboardContainer
    description="Overview of your content management system"
    icon={LayoutDashboard}
    title="Dashboard"
  >
    <div>Dashboard content goes here</div>
  </DashboardContainer>
);

export default AdminPage;
