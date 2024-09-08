import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ChatLoader = () => {
  const getRandomWidth = () => {
    return Math.floor(Math.random() * 300) + 50;
  };

  const getRandomDuration = () => {
    return Math.random() * 8.5 + 0.5; // Random duration between 0.5s and 2s
  };

  return (
    <div className="flex flex-col gap-1 items-start">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className=" bg-gray-400  h-[12px]"
          style={{
            width: `${getRandomWidth()}px`,
            animationDuration: `${getRandomDuration()}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ChatLoader;
