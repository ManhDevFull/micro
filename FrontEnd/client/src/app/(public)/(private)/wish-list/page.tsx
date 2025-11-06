"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
// import { GooglePlay, ShoppingCart } from "iconsax-react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
const products = [
  {
    id: 1,
    name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear Headphones for Workouts and Running, Triple Black",
    price: "$1200",
    stockStatus: "In Stock",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757154537/image_stprfk.png",
  },

  {
    id: 2,
    name: "Simple Mobile 5G LTE Galexy 12 Mini 512GB Gaming Phone",
    price: "$2,300.00",
    stockStatus: "In Stock",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757154538/image_1_xdv8j9.png",
  },

  {
    id: 3,
    name: "Portable Wshing Machine, 11lbs capacity Model 18NMFIAM",
    price: "$70.00",
    stockStatus: "In Stock",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757154538/image_2_aiw2sa.png",
  },

  {
    id: 4,
    name: "TOZO T6 True Wireless Earbuds Bluetooth Headphones Touch Control with Wireless Charging Case IPX8 Waterproof Stereo Earphones in-Ear",
    price: "$220.00",
    stockStatus: "Out of Stock",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757154538/image_3_mhxk0u.png",
  },

  {
    id: 5,
    name: "Wyze Cam Pan v2 1080p Pan/Tilt/Zoom Wi-Fi Indoor Smart Home Camera with Color Night Vision, 2-Way Audio",
    price: "$1,499.99",
    stockStatus: "In Stock",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757154538/image_4_nfehcv.png",
  },
];
  // Định nghĩa interface cho item
  interface Product {
    id: number;
    name: string;
    price: string;
    stockStatus: string;
    img: string;
  }
export default function WishList() {
    const route = useRouter()

  const [wishlistItems, setWishlistItems] = useState(products);

  const handleAddToCart = (item: Product) => {
    setWishlistItems(wishlistItems.filter((i) => i.id !== item.id));
    toast.success("Added to my cart", {
      duration: 3000,
    });
  };

  const handleDelete = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast.success("Deleted", {
      duration: 3000,
    });
  };

  return (
    <main className="pt-2">
      <NavigationPath />
      <BackNavigation />
      <h1 className="font-bold text-xl sm:text-2xl py-2 px-10 md:px-15 xl:px-40">
        WishList
      </h1>
      <div className="overflow-x-auto mx-10 md:mx-15 xl:mx-40">
        <table className="min-w-full rounded-lg border border-gray-200">
          <thead className="bg-gray-100 text-left text-gray-700 border border-gray-200">
            <tr>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                PRODUCTS
              </th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                PRICE
              </th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                STOCK STATUS
              </th>
              <th className="py-3 px-4 font-['Public Sans'] text-[11.53px] whitespace-nowrap">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 flex items-center gap-4" onClick={()=>route.push(`product/${item.id}`)}>
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="font-['Public Sans'] text-[13.45px] font-medium text-gray-800 break-words whitespace-normal">
                    {item.name}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700 font-['Public Sans'] text-[13.45px]">
                  {item.price}
                </td>
                <td
                  className={`py-4 px-4 font-['Public Sans'] text-[13.45px] font-semibold uppercase whitespace-nowrap ${
                    item.stockStatus === "In Stock"
                      ? "text-[#2DB224]"
                      : "text-[#EE5858]"
                  }`}
                >
                  {item.stockStatus}
                </td>
                <td className="py-4 px-4 h-[47px] w-[240px]">
                  <div className="flex items-center justify-between">
                    <button
                      disabled={item.stockStatus !== "In Stock"}
                      onClick={() => handleAddToCart(item)}
                      className={`group relative flex items-center rounded-[5px] justify-center gap-2 font-['Public Sans'] text-[13.45px] font-semibold uppercase whitespace-nowrap h-[47px] w-[167px] overflow-hidden ${
                        item.stockStatus === "In Stock"
                          ? "bg-[#1877F2] hover:text-[#FFFFFF] transition-colors duration-300 cursor-pointer"
                          : "bg-[#ADB7BC] cursor-not-allowed"
                      } text-[#FFFFFF]`}
                    >
                      <span className="relative z-10">ADD TO CART</span>
                      <MdOutlineShoppingCart
                        size={19.21}
                        color="#FFFFFF"
                        className="relative z-10"
                      />
                      {item.stockStatus === "In Stock" && (
                        <span className="absolute inset-0 bg-[#29c9d7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                      )}
                    </button>
                    <IoCloseCircleOutline
                      size={23.05}
                      className="text-[#929FA5] hover:text-[#EE5858] transition-colors duration-300 cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
