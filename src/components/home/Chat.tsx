"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import PageLoader from "@/components/common/PageLoader";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageCustom from "@/components/common/Image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DEFAULT_PROFILE_IMAGE, SEND_ICON } from "@/lib/images";
import { useTranslation } from "react-i18next";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

const Chat = () => {
  const router = useRouter();
  const { t } = useTranslation("home");
  const { user } = useUser();

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showChatView, setShowChatView] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [chatUserList, setChatUserList] = useState<any[]>([]);
  const [chatListTotalRecords, setChatListTotalRecords] = useState(0);
  const [loadingMoreChatList, setLoadingMoreChatList] = useState(false);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const LIMIT = 10;
  const CHAT_LIST_LIMIT = 15;

  const fetchOffsetRef = useRef(0);
  const chatListOffsetRef = useRef(0);
  const messageListRef = useRef<HTMLDivElement>(null);
  const chatListScrollRef = useRef<HTMLDivElement>(null);

  /* 🔹 scroll restore refs */
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  const pendingSentRef = useRef<any>(null);

  const { socket } = useChat();

  const hasMoreMessage = messageList.length < totalRecords && totalRecords > 0;
  const hasMoreChatList =
    chatUserList.length < chatListTotalRecords && chatListTotalRecords > 0;

  /* ========================= USER LIST ========================= */

  useEffect(() => {
    if (!socket) return;
    chatListOffsetRef.current = 0;
    setIsLoading(true);
    socket.emit("getChatUserlist", {
      userId: user?.userId,
      offset: "0",
      limit: String(CHAT_LIST_LIMIT),
      search: "",
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("setChatUserlist", (data: any) => {
      const list = data?.data?.chatList ?? [];
      const total = data?.data?.totalRecords ?? data?.totalRecords ?? 0;
      const offset = chatListOffsetRef.current;
      if (offset === 0) {
        setChatUserList(list);
        setIsLoading(false);
      } else {
        setChatUserList((prev) => [...prev, ...list]);
      }
      setChatListTotalRecords(total);
      setLoadingMoreChatList(false);
    });



    socket.on("handleErrorOnSendMessage", (data: any) => {
      if (!data?.success) {
        toast.error(data?.message);
        return;
      }

      const pending = pendingSentRef.current;
      if (!pending) return;

      const newMessage = {
        messageId: `temp-${Date.now()}`,
        message: pending.message,
        sender: { senderId: pending.senderId },
        createdAt: pending.createdAt,
      };

      setMessageList((prev) => [...prev, newMessage]);

      setChatUserList((prev) => {
        const existing = prev.find((chat) => chat.roomId === pending.roomId);
        if (!existing) return prev;
        const updated = { ...existing, lastMessage: { ...existing.lastMessage, message: pending.message, createdAt: pending.createdAt } };
        const rest = prev.filter((chat) => chat.roomId !== pending.roomId);
        return [updated, ...rest];
      });

      setMessageText("");
      pendingSentRef.current = null;
      scrollToBottom();
    });

    socket.on("setNewMessage", (data: any) => {
      if (!data?.roomId || selectedUser?.roomId !== data.roomId) return;

      const newMessage = {
        messageId: data.messageId,
        message: data.message,
        sender: data.sender ?? { senderId: data.sender?.senderId },
        createdAt: data.createdAt,
      };

      setMessageList((prev) => [...prev, newMessage]);

      setChatUserList((prev) =>
        prev.map((chat) =>
          chat.roomId === data.roomId
            ? {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                message: data.message,
                createdAt: data.createdAt,
              },
            }
            : chat
        )
      );

      setTimeout(() => scrollToBottom(), 50);
    });

    socket.on("updateChatList", (data: any) => {
      if (!data?.roomId) return;
      setChatUserList((prev) => {
        const idx = prev.findIndex((chat) => chat.roomId === data.roomId);
        if (idx >= 0) {
          const updated = { ...prev[idx], ...data };
          const rest = prev.filter((chat) => chat.roomId !== data.roomId);
          return [updated, ...rest];
        }
        return [data, ...prev];
      });
    });

    socket.on("setMessageList", (data: any) => {
      const total = data?.resData?.totalRecords ?? 0;
      const messages = data?.resData?.messages ?? [];
      const reversed = [...messages].reverse();
      const offset = fetchOffsetRef.current;

      const container = messageListRef.current;

      if (offset === 0) {
        setMessageList(reversed);
        setIsLoadingMessage(false);

        setTimeout(() => {
          scrollToBottom();
        }, 50);
      } else {
        setMessageList((prev) => [...reversed, ...prev]);

        setTimeout(() => {
          if (!container) return;

          const newScrollHeight = container.scrollHeight;

          container.scrollTop =
            newScrollHeight -
            prevScrollHeightRef.current +
            prevScrollTopRef.current;
        }, 0);
      }

      setTotalRecords(total);
      setLoadingOlder(false);
    });

    return () => {
      if (!socket) return;
      socket.off("setMessageList");
      socket.off("handleErrorOnSendMessage");
      socket.off("setNewMessage");
      socket.off("updateChatList");
      socket.off("setChatUserlist");
      socket.off("setRoomJoin");
    };
  }, [socket, selectedUser?.roomId]);

  /* ========================= LOAD MESSAGES ========================= */

  useEffect(() => {
    if (!socket || !selectedUser?.roomId) return;
    setMessageList([]);
    setTotalRecords(0);
    setLoadingOlder(false);
    fetchOffsetRef.current = 0;
    setIsLoadingMessage(true);
    socket.on("setRoomJoin", (data: any) => {
      if (data?.status) {
        socket.emit("getMessageList", {
          userId: user?.userId,
          roomId: selectedUser.roomId,
          offset: 0,
          limit: 10,
        });
      }

    });

  }, [socket, selectedUser?.roomId, user?.userId]);

  /* ========================= SCROLL ========================= */

  const scrollToBottom = () => {
    const container = messageListRef.current;

    if (!container) return;

    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  };

  const handleMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (
      !socket ||
      !user?.userId ||
      !selectedUser?.roomId ||
      messageList.length === 0
    )
      return;

    const container = e.currentTarget;

    if (container.scrollTop < 10 && hasMoreMessage && !loadingOlder) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;

      setLoadingOlder(true);

      fetchOffsetRef.current = messageList.length;

      socket.emit("getMessageList", {
        userId: user?.userId,
        roomId: selectedUser.roomId,
        offset: messageList.length,
        limit: LIMIT,
      });
    }
  };

  /* ========================= SEND ========================= */

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!socket || !selectedUser?.roomId) return;
    if (!messageText.trim()) return;

    const createdAt = new Date().toISOString();
    const text = messageText.trim();
    pendingSentRef.current = {
      message: text,
      roomId: selectedUser.roomId,
      createdAt,
      senderId: user?.userId ?? "",
    };


    socket.emit("sendMessage", {
      sender: user?.userId,
      receiver: selectedUser?.chatDetails?.userId,
      roomId: selectedUser?.roomId,
      chatType: "Personal",
      message: text,
      messageType: "text",
      createdAt,
    });




  };

  /* ========================= USER SELECT ========================= */

  const handleUserSelect = (userData: any) => {
    if (!socket) return;

    if (selectedUser?.roomId) {
      socket.emit("roomLeave", {
        userId: user?.userId,
        roomId: selectedUser?.roomId,
      });
    }

    socket.emit("roomJoin", {
      userId: user?.userId,
      roomId: userData?.roomId,
      receiver: userData?.chatDetails?.userId,
      chatType: "Personal",
    });

    if (userData?.unreadmessageCount > 0) {
      setChatUserList((prev) =>
        prev.map((chat) =>
          chat.roomId === userData.roomId
            ? { ...chat, unreadmessageCount: 0 }
            : chat
        )
      );
      setSelectedUser({ ...userData, unreadmessageCount: 0 });
    } else {
      setSelectedUser(userData);
    }
    setShowChatView(true);
  };

  const handleBackClick = () => {
    setShowChatView(false);
    setSelectedUser(null);
  };

  const handleChatListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!socket || !user?.userId) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (!nearBottom || !hasMoreChatList || loadingMoreChatList) return;
    setLoadingMoreChatList(true);
    chatListOffsetRef.current = chatUserList.length;
    socket.emit("getChatUserlist", {
      userId: user?.userId,
      offset: String(chatUserList.length),
      limit: String(CHAT_LIST_LIMIT),
      search: "",
    });
  };

  /* ========================= GROUP MESSAGES ========================= */

  const groupedMessages = messageList?.reduce(
    (acc: Record<string, any[]>, message: any) => {
      const dateKey = new Date(message.createdAt).toISOString().split("T")[0];

      if (!acc[dateKey]) acc[dateKey] = [];

      acc[dateKey].push(message);

      return acc;
    },
    {}
  );

  const sortByDateOnly = (d: string) => {
    const t = new Date(d);
    t.setHours(0, 0, 0, 0);
    return t.getTime();
  };

  const groupedMessageList =
    groupedMessages && Object.keys(groupedMessages).length > 0
      ? Object.entries(groupedMessages)
        .sort(([a], [b]) => sortByDateOnly(a) - sortByDateOnly(b))
        .map(([date, messages]) => {
          const sortedMessages = [...messages].sort(
            (a: any, b: any) =>
              sortByDateOnly(a.createdAt) - sortByDateOnly(b.createdAt)
          );

          const d = new Date(date);

          const formattedDate = d.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return { date, formattedDate, messages: sortedMessages };
        })
      : [];

  return (
    <div className="bg-[#F6F6F7] py-[30px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#5C6268] cursor-pointer"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-[30px] font-medium text-black">{t("Chat")}</h1>
      </div>
      <div className="flex w-full gap-4 h-[75vh] mt-[30px]">
        <aside
          className={cn(
            "w-full lg:w-[370px] bg-white rounded-[24px] p-5 flex flex-col shrink-0 overflow-hidden shadow-[0px_7px_4.6px_0px_#7854B814]",
            showChatView ? "hidden lg:flex" : "flex"
          )}
        >
          <h1 className="text-[22px] sm:text-[26px] font-semibold text-black leading-10 mb-[22px] pb-4 border-b border-[#F6F6F7]">
            {t("messages")}
          </h1>

          <div className="flex-1 min-h-0 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <PageLoader />
              </div>
            ) : chatUserList.length > 0 ? (
              <ScrollArea
                ref={chatListScrollRef}
                onScroll={handleChatListScroll}
                className="h-full"
              >
                <div className="space-y-3">
                  {chatUserList?.map((user) => (
                    <button
                      key={user.roomId}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-[12px] cursor-pointer text-left transition-colors",
                        selectedUser?.roomId === user.roomId
                          ? "bg-primary/10"
                          : "bg-[#F6F6F7] hover:bg-primary/10"
                      )}
                    >
                      <ImageCustom
                        alt={user.chatDetails?.name}
                        src={user.chatDetails?.profile || DEFAULT_PROFILE_IMAGE}
                        className="object-cover size-[60px] rounded-full"
                      />

                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <div className="flex-1">
                          <h2 className="text-sm sm:text-base font-medium line-clamp-1 text-black">
                            {user.chatDetails?.name}
                          </h2>
                          <p className="text-[13px] sm:text-sm font-light line-clamp-1 text-secondary">
                            {user.lastMessage?.message}
                          </p>
                        </div>

                        {user.unreadmessageCount > 0 && (
                          <div className="flex items-center gap-2 bg-primary rounded-full size-[20px] justify-center ">
                            <p className="text-[10px] sm:text-sm font-light line-clamp-1 text-white">
                              {user.unreadmessageCount}
                            </p>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {loadingMoreChatList && (
                  <div className="flex justify-center py-3">
                    <Loader2 className="size-5 animate-spin text-primary" />
                  </div>
                )}
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] px-6 text-center">
                <MessageCircle className="size-16 sm:size-[90px] text-gray-300 mb-4" />
                <p className="text-secondary font-medium text-sm">
                  {t("noMessagesFound")}
                </p>
              </div>
            )}
          </div>
        </aside>
        <div
          className={cn(
            "flex-1 flex flex-col min-h-0 bg-white rounded-[24px] overflow-hidden min-w-0 shadow-[0px_7px_4.6px_0px_#7854B814]",
            showChatView ? "flex" : "hidden lg:flex",
            !selectedUser && "lg:items-center lg:justify-center"
          )}
        >
          {selectedUser ? (
            <>
              <div className="flex md:mx-5 mx-2.5 justify-between items-center py-5 border-b border-[#F6F6F7] shrink-0">
                <div className="flex items-center md:gap-3 gap-1.5">
                  <button
                    type="button"
                    onClick={handleBackClick}
                    className="lg:hidden flex items-center justify-center size-[40px] rounded-full bg-[#F6F6F7] hover:bg-gray-200"
                  >
                    <ChevronLeft className="size-5 text-primary" />
                  </button>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <ImageCustom
                      alt={selectedUser.chatDetails?.name}
                      src={
                        selectedUser.chatDetails?.profile ||
                        DEFAULT_PROFILE_IMAGE
                      }
                      className="object-cover size-[52px] rounded-full"
                    />

                    <h2 className="text-lg sm:text-xl font-semibold text-black">
                      {selectedUser.chatDetails?.name}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                {isLoadingMessage ? (
                  <div className="flex justify-center items-center h-full">
                    <PageLoader />
                  </div>
                ) : (
                  <ScrollArea
                    ref={messageListRef}
                    onScroll={handleMessageScroll}
                    className="h-full px-4 sm:px-5 py-4"
                  >
                    <div className="space-y-6">
                      {loadingOlder && (
                        <div className="flex justify-center py-2">
                          <Loader2 className="size-5 animate-spin text-primary" />
                        </div>
                      )}
                      {groupedMessageList.length > 0 ? (
                        groupedMessageList.map((group) => (
                          <div key={group.date} className="space-y-4">
                            <div className="flex items-center justify-center gap-3.5 py-2">
                              <div className="bg-[#ECECED] h-px w-[72px]" />
                              <p className="text-center text-[13px] sm:text-sm text-black font-medium">
                                {group.formattedDate}
                              </p>
                              <div className="bg-[#ECECED] h-px w-[72px]" />
                            </div>

                            {group.messages.map((msg: any) => {
                              const isOutgoing =
                                msg.sender?.senderId === user?.userId;
                              return (
                                <div
                                  key={msg.messageId}
                                  className={cn(
                                    "flex items-end gap-3",
                                    isOutgoing && "justify-end"
                                  )}
                                >
                                  <p
                                    className={cn(
                                      "max-w-[70%] text-base sm:text-lg font-normal px-6 py-3 rounded-xl",
                                      isOutgoing
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-[#F6F6F7] text-secondary font-medium rounded-bl-none"
                                    )}
                                  >
                                    {msg.message}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px] px-6 text-center">
                          <MessageCircle className="size-16 sm:size-[90px] text-gray-300 mb-4" />
                          <p className="text-secondary font-medium text-sm">
                            {t("noMessagesFound")}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="px-4 sm:px-5 pb-4 sm:pb-5 shrink-0"
              >
                <div className="flex items-center gap-2 bg-[#F6F6F7] rounded-[15px] p-3">
                  <Input
                    type="text"
                    placeholder={t("typeYourMessage")}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend(e)
                    }
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base placeholder:text-secondary placeholder:font-normal shadow-none py-4"
                  />
                  <button type="submit" className="cursor-pointer">
                    <ImageCustom
                      src={SEND_ICON}
                      alt="SEND_ICON"
                      className="size-12 rounded-full"
                    />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center text-center text-secondary">
              <MessageCircle className="size-16 mb-4 opacity-40" />
              <p className="text-secondary font-normal text-base">
                {t("selectAConversation")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
