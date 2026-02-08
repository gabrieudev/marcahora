"use client";

import { PrivateRoutes } from "@/providers/private-routes";
import { ThemeProvider } from "@/providers/theme-provider";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoutes>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="grid grid-rows-[auto_1fr]">
          <main>{children}</main>
        </div>
      </ThemeProvider>
    </PrivateRoutes>
  );
}
