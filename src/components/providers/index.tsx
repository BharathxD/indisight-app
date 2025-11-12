import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeSwitcher } from "@/components/providers/theme-provider";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { Toaster } from "@/components/ui/sonner";
import { TopLoader } from "@/components/ui/toploader";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <ThemeSwitcher>
    <TopLoader />
    <TRPCProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </TRPCProvider>
    <Toaster />
  </ThemeSwitcher>
);
