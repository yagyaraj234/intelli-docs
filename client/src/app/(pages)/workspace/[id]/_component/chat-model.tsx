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

const errorMessage = `## Oops! Something went wrong.
\n\n
Issue identified. Fix coming soon.`;

let timer: any;
export const Chat = () => {
  // @ts-ignore
  const { workspace } = useWorkspace();
  const tapToBottom = useRef<HTMLDivElement | null>(null);
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
      await updateHistory(lastTwoMessages, workspace?.id || "fdjsnfd");
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

  useEffect(() => {
    const chatContainer = tapToBottom?.current;

    // Find the index of the last question
    const lastQuestionIndex = messages
      ?.map((item: any) => item.type)
      ?.lastIndexOf("user");

    // Find the position of the last question
    if (lastQuestionIndex !== -1 && chatContainer) {
      const lastQuestionElement = chatContainer?.children[lastQuestionIndex];
      if (lastQuestionElement) {
        lastQuestionElement?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const stream = async (
    input: string,
    botMessageId: string,
    newMessages: any[]
  ) => {
    setGenerating(true);
    let message = "";

    try {
      if (!workspace) {
        throw new Error("Workspace not found");
      }
      const stream = await streamChat(input, workspace.id);
      for await (const chunk of stream) {
        setGenerating(false);
        message += chunk.text;
        handleSetMessage(message, botMessageId, newMessages);
      }
    } catch (error: any) {
      handleSetMessage(errorMessage, botMessageId, newMessages);
      console.error("Streaming error:", error);
      // toast.error(`Error while creating response: ${error.message}`, {
      //   duration: 5000,
      // });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-x-auto max-h-screen overflow-y-hidden">
      <div
        className="flex-1 p-4 max-h-screen overflow-y-auto scrollbar scrollbar-none"
        ref={tapToBottom}
      >
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
      </div>
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
            className="flex-1 border border-black rounded-lg p-2 h-10 min-h-[40px] max-h-[120px] resize-auto scrollbar scrollbar-none"
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
