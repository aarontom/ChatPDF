"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React, {useState} from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Trash} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import SubscriptionButton from "./SubscriptionButton";
import { drizzle } from 'drizzle-orm';
//import { Client } from 'pg';

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
  onDeleteChat: (chatId: number) => void;
};

const ChatSideBar = ({ chats, chatId, isPro, onDeleteChat }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteChat = async (chatId: number) => {
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/chat/${chatId}`);
      onDeleteChat(chatId); // Callback to parent component to handle state change
    } catch (err) {
      //setError("An error occurred while deleting the chat.");
      //console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-h-screen overflow-scroll p-4 text-gray-200 bg-gray-900">
      <Link href="/" passHref>
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {chats.map((chat) => (
        <div key={chat.id} className="flex justify-between">
          <Link href={`/chat/${chat.id}`} passHref>
            <div className={cn("flex-grow cursor-pointer rounded-lg p-3 text-slate-300 flex items-center", {
              "bg-blue-600 text-white": chat.id === chatId,
              "hover:text-white": chat.id !== chatId,
            })}>
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
          <button
            onClick={() => handleDeleteChat(chat.id)}
            disabled={loading}
            aria-label={`Delete chat ${chat.pdfName}`}
            className="ml-2 hover:text-red-500"
          >
            <Trash />
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ))}
    </div>
  );
};

export default ChatSideBar;