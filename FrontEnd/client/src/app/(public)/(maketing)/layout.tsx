"use client";
import CategoryComponent from "@/components/templates/layout/CategoryComponent";
import BackNavigation from "@/components/ui/BackNavigation";
import type { ReactNode } from "react";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <CategoryComponent />
      {children}
    </>
  );
}
