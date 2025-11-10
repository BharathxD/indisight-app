import type { LucideIcon } from "lucide-react";

type DashboardContainerProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
};

export const DashboardContainer = ({
  title,
  description,
  icon: Icon,
  children,
}: DashboardContainerProps) => (
  <div className="flex h-full flex-col">
    <header className="border-b px-6 py-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate font-semibold text-xl leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="truncate text-muted-foreground text-sm leading-tight">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
    <main className="flex-1 overflow-auto p-6">{children}</main>
  </div>
);
