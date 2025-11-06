'use client'


import { Brands } from "@/components/templates/brands/brands";
import DealsDay from "@/components/templates/dealsDay/dealsDay";
import EBrand from "@/components/templates/electronicBrands/eBrand";
import { Features } from "@/components/templates/features/features";
import Frequently from "@/components/templates/frequently/frequenty";
import ShopByCategory from "@/components/templates/shopByCategory/ShopByCategory";
import { Slider } from "@/components/templates/slider/slider";
import React from "react";

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export default function Home({ children, params }: RootLayoutProps) {
  return (
    <div className="w-full p-0">
      <Slider/>
      <Features/>
      <Brands/>
      <DealsDay/>
      <ShopByCategory/>
      <EBrand/>
      <Frequently/>
    </div>
  );
}
