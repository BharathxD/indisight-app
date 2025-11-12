"use client";

import {
  Archive,
  FileCheck,
  FileEdit,
  FileText,
  FolderOpen,
  Tag,
  Users,
} from "lucide-react";
import { ArticlesChart } from "@/components/admin/dashboard/articles-chart";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { DashboardContainer } from "@/components/dashboard-container";
import { trpc } from "@/trpc/client";

const AdminPage = () => {
  const { data: overview, isLoading } = trpc.analytics.getOverview.useQuery();

  return (
    <DashboardContainer
      description="Overview of your content management system"
      icon={FileText}
      title="Dashboard"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileText}
            title="Total Articles"
            value={isLoading ? "..." : (overview?.totalArticles ?? 0)}
          />
          <StatCard
            icon={Users}
            title="Authors"
            value={isLoading ? "..." : (overview?.totalAuthors ?? 0)}
          />
          <StatCard
            icon={FolderOpen}
            title="Categories"
            value={isLoading ? "..." : (overview?.totalCategories ?? 0)}
          />
          <StatCard
            icon={Tag}
            title="Tags"
            value={isLoading ? "..." : (overview?.totalTags ?? 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={FileEdit}
            title="Draft"
            value={isLoading ? "..." : (overview?.statusCounts.DRAFT ?? 0)}
          />
          <StatCard
            icon={FileCheck}
            title="Published"
            value={isLoading ? "..." : (overview?.statusCounts.PUBLISHED ?? 0)}
          />
          <StatCard
            icon={Archive}
            title="Archived"
            value={isLoading ? "..." : (overview?.statusCounts.ARCHIVED ?? 0)}
          />
        </div>

        <ArticlesChart />
      </div>
    </DashboardContainer>
  );
};

export default AdminPage;
