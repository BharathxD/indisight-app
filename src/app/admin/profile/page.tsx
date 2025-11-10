import { User } from "lucide-react";
import { DashboardContainer } from "@/components/dashboard-container";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { ProfileInfo } from "@/components/profile/profile-info";

const ProfilePage = () => (
  <DashboardContainer
    description="Manage your account settings and security"
    icon={User}
    title="Profile"
  >
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <ProfileInfo />
      <ChangePasswordForm />
    </div>
  </DashboardContainer>
);

export default ProfilePage;
