import { ThreadResponse } from "@/types/type";
import { useEffect, useMemo, useRef, useState } from "react";

type ConversationWindowProps = {
  thread: ThreadResponse;
  positionIndex: number;
  onClose: () => void;
  onSendMessage: (participantId: number, content: string) => void;
};

export default function ConversationWindow({
  thread,
  positionIndex,
  onClose,
  onSendMessage,
}: ConversationWindowProps) {
  const [draft, setDraft] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSendMessage(thread.contactId, trimmed);
    setDraft("");
  };

  return (
    <div
      className="fixed bottom-5 z-40 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
      style={{ right: `calc(1rem + ${positionIndex} * 20.3rem)` }}
    >
      <header className="flex items-center justify-between bg-gray-400 px-3 py-2 text-white">
        <div>
          <h3 className="text-sm font-semibold leading-snug">
            {thread.contactName}
          </h3>
          <p className="text-xs text-slate-300">Active now</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-slate-200 hover:bg-slate-700 hover:text-white"
        >
          ×
        </button>
      </header>
      <div className="flex h-104 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3 text-sm text-slate-900">
          {thread.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === thread.contactId
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  message.senderId === thread.contactId
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-indigo-600 text-white"
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="border-t border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3">
            <input
              className="h-9 flex-1 bg-transparent text-sm focus:outline-none"
              placeholder="Aa"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
              disabled={!draft.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
