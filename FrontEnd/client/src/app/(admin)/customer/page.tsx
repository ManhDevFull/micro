"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AiTwotoneSetting } from "react-icons/ai";
import { useEffect, useState } from "react";
import { IUser } from "@/types/type";
import handleAPI from "@/axios/handleAPI";
import ActionMenu from "@/components/ui/AvtionMenu";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import EditUser from "@/components/modules/editUser";
import ViewUser from "@/components/modules/viewUser";
import ChooseModule from "@/components/modules/ChooseModal";

export default function CustomerPage() {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [isModalDel, setIsModalDel] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  useEffect(() => {
    let cancelled = false;
    const getUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await handleAPI("/admin/User");
        if (cancelled) return;
        if (res?.status === 200 && Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (!cancelled) {
          setUsers([]);
          const message =
            res &&
            typeof res === "object" &&
            "message" in res &&
            typeof (res as { message?: unknown }).message === "string"
              ? ((res as { message?: unknown }).message as string)
              : "Failed to load customers.";
          setError(message);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setUsers([]);
          const fallback = "Failed to load customers.";
          if (
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as { message?: unknown }).message === "string"
          ) {
            setError((err as { message?: string }).message ?? fallback);
          } else if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof (err as { response?: { data?: { message?: unknown } } }).response?.data
              ?.message === "string"
          ) {
            setError(
              ((err as { response?: { data?: { message?: unknown } } }).response!.data!
                .message ?? fallback) as string
            );
          } else {
            setError(fallback);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    getUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleView = (user: IUser, type: string) => {
    setSelectedUser(user);
    if (type === "view") setIsModalView(true);
    if (type === "edit") setIsModalEdit(true);
    if (type === "del") setIsModalDel(true);
  };

  return (
    <div className="rounded-lg bg-[#D9D9D940] p-2 shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-full">
      <h1 className="font-medium text-[26px] mb-2">Customers</h1>
      <div className="grid grid-cols-24 border-t border-gray-200 shadow overflow-hidden">
        {/* header */}
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          #
        </div>{" "}
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 pl-1 text-center">
          Avatar
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-6 pl-1">
          Name Customer
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-3 text-center  pl-1">
          Orders
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-4 pl-1">
          Telephone
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-5 pl-1">
          Email
        </div>
        <div className="text-[#474747] py-2 bg-[#00000007] col-span-2 text-center">
          Actions
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center border-t border-gray-200 bg-white py-6 text-sm text-gray-500 shadow">
          Loading customers...
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center justify-center border-t border-red-200 bg-red-50 py-6 text-sm text-red-600 shadow">
          {error}
        </div>
      )}
      {!loading &&
        !error &&
        users.map((user: IUser, index) => (
          <div
            key={index}
            className="grid grid-cols-24 border-t h-15 border-gray-200 shadow items-center"
          >
            <div className="text-[#474747] py-2 bg-[#ffffff] flex items-center h-full col-span-2 justify-center">
              {index + 1}
            </div>{" "}
            <div className="text-[#474747] py-2 bg-[#ffffff] h-full col-span-2 pl-1 flex items-center justify-center">
              <Image
                className="rounded-full shadow"
                height={40}
                width={40}
                src={
                  "https://res.cloudinary.com/do0im8hgv/image/upload/v1755761340/370e0dbb-f34c-4ba7-8e5c-797f036749ee.png"
                }
                alt={user.name}
              />
            </div>
            <div className="text-[#474747] py-2 bg-[#ffffff] flex items-center h-full col-span-6 pl-1">
              {user.name}
            </div>
            <div className="text-[#474747] py-2 bg-[#ffffff] flex items-center h-full col-span-3 justify-center pl-1">
              {user.orders}
            </div>
            <div className="text-[#474747] py-2 bg-[#ffffff] flex items-center h-full col-span-4 pl-1">
              (+84) 799000000
            </div>
            <div className="text-[#474747] py-2 bg-[#ffffff] flex items-center h-full col-span-5 pl-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="w-full truncate">{user.email}</p>
                  </TooltipTrigger>
                  <TooltipContent side="top">{user.email}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-[#474747] py-2 bg-white flex items-center h-full col-span-2 justify-center">
              <ActionMenu
                onView={() => handleView(user, "view")}
                onEdit={() => handleView(user, "edit")}
                onDelete={() => handleView(user, "del")}
              />
            </div>
          </div>
        ))}
      <EditUser
        onClose={() => setIsModalEdit(false)}
        visible={isModalEdit}
        user={selectedUser}
      />
      <ViewUser
        onClose={() => setIsModalView(false)}
        visible={isModalView}
        user={selectedUser}
      />
      <ChooseModule
        text="Are you sure you want to delete this user?"
        styleYes="bg-[#ff000095] text-white"
        open={isModalDel}
        onClose={() => setIsModalDel(false)}
        onYes={() => {
          console.log("yes");
          setIsModalDel(false)
        }}
      />
    </div>
  );
}
