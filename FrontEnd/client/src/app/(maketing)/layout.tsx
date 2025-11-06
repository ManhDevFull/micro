"use client";
import "../globals.css";
import { Provider } from "react-redux";
import Link from "next/link";
import HeaderComponent from "@/components/templates/layout/HeaderComponent";
import CategoryComponent from "@/components/templates/layout/CategoryComponent";
import FooterComponent from "@/components/templates/layout/FooterComponent";
import { Toaster } from "sonner";
import store from "@/redux/store";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster richColors position="top-right" toastOptions={{ className: '!text-base !pl-7 !py-5 !shadow-xl'}}/>
          <div className="h-11 bg-black hidden sm:flex justify-between sm:px-10 md:px-20 lg:px-30 xl:px-40 2xl:px-50">
            <p className="text-white h-full flex items-center">
              Welcome Suprava Saha !
            </p>
            <p className="h-full flex items-center">
              <Link
                href={"/track-order"}
                className="border-r text-white w-44 flex justify-center"
              >
                Track your order
              </Link>
              <Link
                href={"/offers"}
                className="text-white w-32 flex justify-center"
              >
                All Offers
              </Link>
            </p>
          </div>

          <HeaderComponent />
          <CategoryComponent />
          {children}
          <FooterComponent />
        </Provider>
      </body>
    </html>
  );
}
