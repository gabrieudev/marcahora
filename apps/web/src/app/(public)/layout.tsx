"use client";

import { PublicRoutes } from "@/providers/public-routes";
import Header from "./components/header";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoutes>
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </PublicRoutes>
  );
}
