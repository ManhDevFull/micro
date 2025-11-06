"use client";
import "../globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Link from "next/link";
import HeaderComponent from "@/components/templates/layout/HeaderComponent";
import FooterComponent from "@/components/templates/layout/FooterComponent";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

export default function PublicRootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{ className: "!text-base !pl-7 !py-5 !shadow-xl" }}
          />
          <div className="hidden h-11 items-center justify-between bg-black sm:flex sm:px-10 md:px-20 lg:px-30 xl:px-40 2xl:px-50">
            <p className="flex h-full items-center text-white">
              Welcome Suprava Saha !
            </p>
            <p className="flex h-full items-center">
              <Link
                href="/track-order"
                className="flex w-44 justify-center border-r text-white"
              >
                Track your order
              </Link>
              <Link href="/offers" className="flex w-32 justify-center text-white">
                All Offers
              </Link>
            </p>
          </div>
          <HeaderComponent />
          {children}
          <FooterComponent />
        </Provider>
      </body>
    </html>
  );
}
