import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { icons, images } from "@/constants";
import { Image } from "react-native";
import tw from "twrnc";
import { router } from "expo-router"; // Using Expo Router instead of React Navigation


interface Message {
  id: string;
  conversationId: string;
  pharmacyId: string;
  userId?: string;
  content: string;
  senderType: string;
  isRead: boolean;
  createdAt: string;
}

interface PharmacieProfileChatProps {
  pharmacyId:string;
  conversationId:string;
  pharmacieName: string;
  Message: Message;
  unreadMessagesCount?: number;
}

const PharmacieProfileChat = ({
  pharmacyId,
  pharmacieName,
  Message,
  conversationId,
  unreadMessagesCount = 0,
}: PharmacieProfileChatProps) => {

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error("Error formatting time:", e);
      return '';
    }
  };

  return (
    <TouchableOpacity
      className="w-full p-2 flex flex-row justify-between items-center gap-4"
      onPress={() => {
        router.push({
          pathname: "/(root)/chatBox",
          params: { 
            pharmacyId: pharmacyId,
            conversationId: conversationId,
            pharmacieName: pharmacieName 
          }
        });
      }}
    >
      <View className="w-full flex-shrink flex-row items-center gap-4 ">
        <View className="rounded-full">
          <Image source={icons.SelectedPharmacy} style={tw`w-10 h-10`} />
        </View>

        <View className="flex-shrink flex-col items-start ">
          <View className="w-full flex-shrink flex-row items-start justify-between gap-4">
            <Text className="font-PoppinsSemiBold text-lg">
              {pharmacieName}
            </Text>
            <Text className="font-Poppins text-xs text-neutral-400 pt-1">
              {formatTime(Message.createdAt)}
            </Text>
          </View>

          <View className="w-full flex-shrink flex-row items-center justify-between gap-4">
            <Text
              className="font-Poppins text-xs text-neutral-400 flex-shrink"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {Message.content}
            </Text>

            {unreadMessagesCount > 0 && (
              <View className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Text className="font-PoppinsMedium text-sm pt-[1px] text-white">
                  {unreadMessagesCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PharmacieProfileChat;