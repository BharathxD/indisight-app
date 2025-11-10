import { Sidebar } from "@/components/nav/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: React.PropsWithChildren) => (
  <SidebarProvider>
    <Sidebar />
    <main className="flex flex-1 flex-col">{children}</main>
  </SidebarProvider>
);

export default AdminLayout;
