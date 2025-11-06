"use client";
import axiosClient from "@/axios/axiosClient";
import handleAPI from "@/axios/handleAPI";
import ChatInbox from "@/components/chat/ChatInbox";
import ConversationWindow from "@/components/chat/ConversationWindow";
import {
  addAuth,
  authSelector,
  removeAuth,
  UserAuth,
} from "@/redux/reducers/authReducer";
import { ThreadResponse } from "@/types/type";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiMessageRoundedDots } from "react-icons/bi";
import { DiGnu } from "react-icons/di";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
const CHAT_API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://localhost:5295/api/chat";

export default function HeaderAdminComponent() {
  const dispatch = useDispatch();
  const route = useRouter();
  const auth: UserAuth = useSelector(authSelector);
  const [userInfo, setUserInfo] = useState<UserAuth>(auth);

  const [chatOpen, setChatOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [chatThreads, setChatThreads] = useState<ThreadResponse[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [openChats, setOpenChats] = useState<ThreadResponse[]>([]);

  const chatButtonRef = useRef<HTMLButtonElement | null>(null);
  const notifButtonRef = useRef<HTMLButtonElement | null>(null);
  const chatPanelRef = useRef<HTMLDivElement | null>(null);

  // 🧠 Load token từ localStorage khi reload
  useEffect(() => {
    const res = localStorage.getItem("token");
    if (res) {
      const parsed = JSON.parse(res);
      dispatch(addAuth(parsed));
      setUserInfo(parsed);
    }
  }, [dispatch]);

  // 🚀 Gọi API lấy danh sách thread
  const fetchThreads = async () => {
    if (!userInfo.token) return;
    try {
      setLoadingThreads(true);
      const res = await axiosClient.get<ThreadResponse[]>(
        `${CHAT_API_BASE}/messages/grouped`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      const data = res.data ?? res;
      const sorted = [...data].sort(
        (a, b) =>
          Date.parse(b.lastTimestamp) - Date.parse(a.lastTimestamp)
      );
      setChatThreads(sorted);
    } catch (error: any) {
      console.error("Fetch chat threads error:", error);
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    if (userInfo.token) void fetchThreads();
  }, [userInfo.token]);

  // 🔢 Tổng số tin nhắn chưa đọc
  const totalUnread = chatThreads.reduce(
    (acc, thread) => acc + thread.unreadCount,
    0
  );

  // 🧠 Click ngoài thì đóng popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        chatOpen &&
        chatPanelRef.current &&
        !chatPanelRef.current.contains(target) &&
        !chatButtonRef.current?.contains(target)
      ) {
        setChatOpen(false);
      }
      if (
        notificationOpen &&
        notifButtonRef.current &&
        !notifButtonRef.current.contains(target) &&
        !notifButtonRef.current?.contains(target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatOpen, notificationOpen]);

  // 🗨️ Mở cửa sổ chat
  const openConversation = (thread: ThreadResponse) => {
    setOpenChats((prev) => {
      const exists = prev.some((c) => c.contactId === thread.contactId);
      if (exists) return prev; // tránh trùng
      return [...prev, thread];
    });
    setChatOpen(false);
  };

  // ❌ Đóng cửa sổ chat
  const closeConversation = (contactId: number) => {
    setOpenChats((prev) =>
      prev.filter((c) => c.contactId !== contactId)
    );
  };

  // ✉️ Gửi tin nhắn (giả lập)
  const handleSendMessage = (receiverId: number, content: string) => {
    console.log(`Send to ${receiverId}:`, content);
    // sau này thêm gọi API POST message
  };

  // 🔐 Logout
  const logout = async () => {
    const res: any = await handleAPI("Auth/logout", {}, "post");
    if (res.status === 200) {
      dispatch(removeAuth());
      route.push("/");
    }
  };

  return (
    <>
      <header className="w-full shadow h-[70px] flex px-15 items-center justify-between">
        <div className="h-full flex items-center">
          <DiGnu
            size={80}
            className="drop-shadow-[0.5px_0.5px_2px_rgba(0,0,0,1)]"
          />
          <h1 className="lakki-reddy-regular h-5 text-4xl text-center drop-shadow-[1px_0.5px_2px_rgba(0,0,0,33)]">
            Vertex ADMIN
          </h1>
        </div>

        <div className="flex items-center pr-20">
          {/* 🗨️ Chat */}
          <div className="relative">
            <button
              ref={chatButtonRef}
              className="shadow w-10 h-10 flex items-center justify-center rounded-lg bg-[#F7F7F7]"
              onClick={() => {
                setChatOpen((prev) => !prev);
                setNotificationOpen(false);
              }}
            >
              <BiMessageRoundedDots size={25} />
              {totalUnread > 0 && (
                <p className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 shadow rounded-full bg-[#FF7F7F] px-1.5 h-[18px] flex items-center justify-center text-white text-[12px]">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </p>
              )}
            </button>

            {chatOpen && (
              <ChatInbox
                ref={chatPanelRef}
                threads={chatThreads}
                loading={loadingThreads}
                onOpenThread={(id) => {
                  const thread = chatThreads.find(
                    (t) => t.contactId === id
                  );
                  if (thread) openConversation(thread);
                }}
              />
            )}
          </div>

          {/* 🔔 Notification */}
          <div className="relative ml-4">
            <button
              ref={notifButtonRef}
              className="shadow w-10 h-10 flex items-center justify-center rounded-lg bg-[#F7F7F7]"
            >
              <IoMdNotificationsOutline size={25} />
            </button>
          </div>

          {/* 👤 User */}
          <div className="flex items-center ml-8">
            <button className="shadow px-8 rounded-lg h-10 bg-[#FBF0F0] text-[#474747] ">
              Hello, {userInfo.name}
            </button>
            <button
              onClick={logout}
              className="shadow text-[#474747] ml-4 px-5 rounded-lg h-10 bg-[#F7F7F7] flex items-center"
            >
              <TbLogout size={25} />
              <p className="pl-2">Log out</p>
            </button>
          </div>
        </div>
      </header>

      {/* 💬 Hiển thị các cửa sổ chat đang mở */}
      {openChats.map((chat, index) => (
        <ConversationWindow
          key={chat.contactId}
          thread={chat}
          positionIndex={index}
          onClose={() => closeConversation(chat.contactId)}
          onSendMessage={handleSendMessage}
        />
      ))}
    </>
  );
}
