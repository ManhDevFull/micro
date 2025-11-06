"use client";
import BackNavigation from "@/components/ui/BackNavigation";
import NavigationPath from "@/components/ui/NavigationPath";
import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CiCamera } from "react-icons/ci";

import AccountForm from "@/components/templates/User/Account_Form";
import AddressForm from "@/components/templates/User/Address_Form";
import OrderHistory from "@/components/templates/User/Order_History";
import OrderDetail from "@/components/templates/User/Order_Detail";
import handleAPI from "@/axios/handleAPI";
import {
  authSelector,
  removeAuth,
  updateAuthAvatar,
  UserAuth,
} from "@/redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";

const menuItems = [
  {
    id: "account",
    label: "MY ACCOUNT",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png",
    bg: "bg-[#C2E6FF]",
  },
  {
    id: "orders",
    label: "ORDER HISTORY",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949098/image_2_h5wwjb.png",
    bg: "bg-[#FFEBBB]",
  },
  {
    id: "address",
    label: "ADDRESS",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949103/image_3_f2tien.png",
    bg: "bg-[#E9FFC7]",
  },
  {
    id: "logout",
    label: "LOGOUT",
    img: "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949115/image_4_wgcv2s.png",
    bg: "bg-[#FFD7DC]",
  },
];

export default function User() {
  const [active, setActive] = useState("account");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const auth: UserAuth = useSelector(authSelector);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = async (id: SetStateAction<string>) => {
    if (id === "logout") {
      try {
        const res: any = await handleAPI("Auth/logout", {}, "post");
        if (res.status === 200) {
          toast.success(res.message);
        }
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      } finally {
        dispatch(removeAuth());
        router.push("/");
      }
      return;
    }

    setSelectedOrderId(null);
    setActive(id);
  };

  // Xử lý khi người dùng chọn file ảnh mới
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await handleAvatarUpload(file);
    }
  };

  // Upload avatar mới và cập nhật Redux
  const handleAvatarUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;

    // Tạo FormData để gửi file
    const uploadData = new FormData();
    uploadData.append("file", fileToUpload);
    try {
      toast.loading("Đang cập nhật avatar...");

      // Gọi API (POST /User/avatar)
      const response: any = await handleAPI("/User/avatar", uploadData, "post");

      // BE trả về { message: "...", avatarUrl: "new_url" }
      const newAvatarUrl = response.avatarUrl;

      // Cập nhật avatar mới vào Redux
      dispatch(updateAuthAvatar({ avata: newAvatarUrl }));

      toast.dismiss();
      toast.success(response.message || "Cập nhật avatar thành công!");

    } catch (error: any) {
      toast.dismiss();
      console.error("Lỗi upload avatar:", error);
      toast.error(error.response?.data?.message || "Tải ảnh lên thất bại.");
    }
  };

  return (
    <main className="pt-2">
      <NavigationPath />
      <BackNavigation />
      <div className="container mx-auto pt-5 pl-40 pb-12 px-35">
        <h1 className="text-3xl font-bold mb-6">MY PROFILE</h1>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-[390px] h-[580px] bg-white shadow rounded-xl p-6 flex flex-col items-center border border-gray-300">
            <div className="relative">
              <img
                src={
                  auth.avata || // Ảnh lấy từ Redux (sẽ tự cập nhật khi dispatch)
                  "https://res.cloudinary.com/do0im8hgv/image/upload/v1757949054/image_zbt0bw.png"
                }
                alt="profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {/* 5. Sửa nút camera */}
              <button
                className="absolute bottom-2 right-2 bg-black text-white text-xs p-2 rounded-full"
                onClick={() => fileInputRef.current?.click()} // Kích hoạt input file
              >
                <CiCamera size={20} />
              </button>
            </div>

            {/* 6. Thêm input file ẩn */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
              accept="image/png, image/jpeg, image/gif" // Chỉ chấp nhận ảnh
            />

            <h2 className="mt-4 font-semibold text-lg">{auth.name || "User"}</h2>

            {/* Menu Wrapper (giữ nguyên) */}
            <div className="mt-6 w-full rounded-lg p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full h-[140px] flex flex-col items-center justify-center p-4 rounded-lg transition-all
                      ${
                        active === item.id
                          ? "bg-white border border-[#1877F2]"
                          : `${item.bg} border border-transparent hover:bg-white hover:border-[#1877F2]`
                      }
                    `}
                  >
                    <img src={item.img} className="w-[70px] h-[70px]" />
                    <span
                      className={`mt-2 text-[14px] font-bold ${
                        active === item.id ? "text-[#1877F2]" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content (giữ nguyên) */}
          <div className="flex-1">
            {active === "account" && <AccountForm />}
            {active === "address" && <AddressForm />}
            {active === "orders" && !selectedOrderId && (
              <OrderHistory onSelectOrder={(id) => setSelectedOrderId(id)} />
            )}
            {active === "orders" && selectedOrderId && (
              <OrderDetail
                orderId={selectedOrderId}
                onBack={() => setSelectedOrderId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
