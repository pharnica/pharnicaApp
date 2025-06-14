import React from "react";
import {
  Text,
  View,
} from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";

interface Message {
     id: string;
     conversationId: string;
     pharmacyId: string;
     userId?: string;
     senderType: "USER" | "PHARMACY";
     content: string;
     isRead: boolean;
     createdAt: string;
   }
   

const MessageItem: React.FC<{
  message: Message;
  formatTime: (isoString: string) => string;
}> = ({ message, formatTime }) => (
  <View
    className={`flex mt-2 ${
      message.senderType === "USER" ? "items-end" : "items-start"
    }`}
  >
    <View
      className={`max-w-[80%] rounded-lg p-3 ${
        message.senderType === "USER"
          ? "bg-green-500 rounded-tr-none"
          : "bg-white rounded-tl-none border border-neutral-100"
      }`}
    >
      <Text
        className={`font-Poppins ${
          message.senderType === "USER" ? "text-white" : "text-gray-800"
        }`}
      >
        {message.content}
      </Text>
      <View className="flex-row justify-between items-center mt-1">
        <Text
          className={`text-xs ${
            message.senderType === "USER" ? "text-green-100" : "text-gray-400"
          }`}
        >
          {formatTime(message.createdAt)}
        </Text>
        {message.senderType === "USER" && (
          <View className="ml-2">
            {message?.isRead ? (
              <View className="flex-row">
                <CheckIcon size={14} color="#D1FAE5" />
                <CheckIcon
                  size={14}
                  color="#D1FAE5"
                  style={{ marginLeft: -9 }}
                />
              </View>
            ) : (
              <CheckIcon size={14} color="#D1FAE5" />
            )}
          </View>
        )}
      </View>
    </View>
  </View>
);


export default MessageItem