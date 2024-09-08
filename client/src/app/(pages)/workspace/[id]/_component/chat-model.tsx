import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { streamChat, updateHistory } from "@/services/chat/chat";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { loadMarkdown } from "@/utils/markdown";
import ChatLoader from "./chat-loader";
import { useWorkspace } from "@/hooks/use-workspace";

let timer: any;
export const Chat = () => {
  // @ts-ignore
  const { workspace } = useWorkspace();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [generating, setGenerating] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workspace?.history) {
      setMessages(workspace.history);
    }
  }, [workspace]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateChat = async (newMessages: any[]) => {
    const lastTwoMessages = newMessages.slice(-2);

    clearTimeout(timer);
    timer = setTimeout(async () => {
      await updateHistory(lastTwoMessages, workspace.id);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessageId = Math.floor(Math.random() * 204300).toString();
      const botMessageId = Math.floor(Math.random() * 204300).toString();
      const dateTime = new Date().toISOString();

      const newMessages = [
        ...messages,
        {
          type: "user",
          content: inputMessage,
          id: userMessageId,
          date: dateTime,
        },
        { type: "bot", content: "", id: botMessageId, date: dateTime },
      ];

      setMessages(newMessages);
      setInputMessage("");
      await stream(inputMessage, botMessageId, newMessages);
    }
  };

  const handleSetMessage = (
    content: string,
    id: string,
    newMessages: any[]
  ): void => {
    const updatedMessages = newMessages.map((message) =>
      message.id === id ? { ...message, content } : message
    );
    setMessages(updatedMessages);
    updateChat(updatedMessages);
  };

  const stream = async (
    input: string,
    botMessageId: string,
    newMessages: any[]
  ) => {
    setGenerating(true);
    let message = "";

    try {
      const stream = await streamChat(input, workspace.id);
      for await (const chunk of stream) {
        setGenerating(false);
        message += chunk.text;
        handleSetMessage(message, botMessageId, newMessages);
      }
    } catch (error: any) {
      handleSetMessage(
        `# Oops! Something went wrong

Hey there! I'm the solo developer behind WorkBot, and it looks like we've hit a snag.

I work on this project in my free time after my 9-5 job, so it might take me a bit to investigate and fix the issue. But don't worry, I'm on it!

Thanks for your patience and for using WorkBot. I'll get things back up and running as soon as I can.

Check back later for updates, and thanks for understanding!

- Your dedicated WorkBot developer`,
        botMessageId,
        newMessages
      );
      console.error("Streaming error:", error);
      toast.error(`Error while creating response: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-x-auto">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages?.map((message: any, index: number) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[95%] text-sm p-2 rounded-lg break-words overflow-x-auto scrollbar-none ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: loadMarkdown(message.content),
                  }}
                />
              </div>
            </div>
          ))}
          {generating && <ChatLoader />}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
              if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                setInputMessage(inputMessage + "\n");
              }
            }}
            placeholder="Type your message..."
            className="flex-1 border border-black rounded-lg p-2 h-10 min-h-[40px] max-h-[120px] resize-auto"
          />
          <Button onClick={handleSendMessage}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
