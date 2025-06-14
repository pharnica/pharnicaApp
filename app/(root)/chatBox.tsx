import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon, CheckIcon } from "react-native-heroicons/outline";
import { icons } from "@/constants";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
import { useSocketContext } from "@/context/SocketContext";
import { useUserData } from "@/context/UserContext";
import MessageItem from "@/components/MessageItem";
import ChatInput from "@/components/ChatInput";

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

const ChatBox = () => {
  const { pharmacyId, conversationId, pharmacieName } = useLocalSearchParams<{
    pharmacyId: string;
    conversationId: string;
    pharmacieName: string;
  }>();
  const { socket, isConnected } = useSocketContext();
  const { userData } = useUserData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const lastReadUpdate = useRef<number>(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const handleMessageRead = useCallback(
    ({
      conversationId: receivedConversationId,
    }: {
      conversationId: string;
    }) => {
      setMessages((prev) => {
        const updatedMessages = prev.map((msg) =>
          msg.senderType === "USER" ? { ...msg, isRead: true } : msg
        );
        return updatedMessages;
      });
    },
    [conversationId]
  );

  const markMessagesAsRead = useCallback(async () => {
    const now = Date.now();
    if (now - lastReadUpdate.current < 1000) return;

    if (!userData?.user_id || !conversationId || messages.length === 0) return;

    try {
      const hasUnread = messages.some(
        (msg) => msg.senderType === "PHARMACY" && !msg.isRead
      );

      if (hasUnread) {
        await axios.patch(
          `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/messages/markMessagesAsRead/${conversationId}`,
          { userId: userData?.user_id }
        );
        lastReadUpdate.current = now;

        setMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.senderType === "PHARMACY" ? { ...msg, isRead: true } : msg
          );
          return updatedMessages;
        });
      }
    } catch (error) {
      console.log("Read status update failed (non-critical)", error);
    }
  }, [userData?.user_id, conversationId, messages]);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const handleNewMessage = (message: Message) => {
      if (message.senderType === "PHARMACY") {
        setMessages((prev) => {
          const updatedMessages = [...prev, message];
          return updatedMessages;
        });
        
        markMessagesAsRead();
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessageRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessageRead);
    };
  }, [
    socket,
    isConnected,
    conversationId,
    handleMessageRead,
    markMessagesAsRead,
  ]);

  const fetchMessages = useCallback(
    async (since?: string) => {
      if (!userData?.user_id || !conversationId) return;

      try {
        const params: any = { pharmacyId, userId: userData?.user_id };
        if (since) {
          params.since = since;
        }

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/messages/fetchMessages`,
          { params }
        );

        const newMessages = response.data.messages;

        setMessages((prev) => {
          const allMessages = [...prev, ...newMessages].reduce(
            (acc: Message[], msg) => {
              if (!acc.some((m) => m.id === msg.id)) {
                acc.push(msg);
              }
              return acc;
            },
            []
          );
          allMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          return allMessages;
        });

        markMessagesAsRead();
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData?.user_id, conversationId, pharmacyId, markMessagesAsRead]
  );

  useEffect(() => {
    if (userData?.user_id) {
      const latestMessage = messages[messages.length - 1];
      fetchMessages(latestMessage?.createdAt);
    }
  }, [userData?.user_id, fetchMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !userData?.user_id || isSending) return;

    const tempId = Date.now().toString();
    const newMessageData = {
      id: tempId,
      conversationId: conversationId || "",
      pharmacyId: pharmacyId || "",
      content: newMessage,
      senderType: "USER" as const,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSending(true);

      const formData = {
        content: newMessage,
        senderType: "USER",
        userId: userData?.user_id,
        pharmacyId: pharmacyId,
      };

      await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/messages/addMessage/${conversationId}`,
        formData
      );

      setNewMessage("");
      
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("Error", "Failed to send message");
      setMessages((prev) => {
        const updatedMessages = prev.filter((msg) => msg.id !== tempId);
        return updatedMessages;
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return "";
    }
  };

  return (
    <View className="h-full bg-gray-50">
      {/* Header */}
      <View className="w-full flex flex-row items-center justify-start gap-5 bg-white py-3 px-6 border-b border-b-neutral-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={22} color="black" strokeWidth={2} />
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center gap-2">
          <View className="rounded-full">
            <Image
              source={icons.SelectedPharmacy}
              style={tw`w-9 h-9`}
              resizeMode="contain"
            />
          </View>
          <Text className="font-PoppinsMedium text-lg pt-1" numberOfLines={1}>
            {pharmacieName || "Unknown Pharmacy"}
          </Text>
          {!isConnected && (
            <View className="ml-2 w-2 h-2 rounded-full bg-red-500" />
          )}
        </View>
      </View>

      {/* Messages Area */}
      <SafeAreaView style={tw`px-4 flex-1`}>
        <StatusBar backgroundColor="rgb(243 244 246)" barStyle="dark-content" />

        {isLoading && messages.length === 0 ? (
          <View className="2560 items-center bg-gray-50">
            <ActivityIndicator size="large" color="#10B981" />
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            onLayout={() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: false });
              }
            }}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View className="flex-1 justify-center items-center pt-10">
                <Text className="font-Poppins text-gray-400">
                  No messages yet. Start the conversation!
                </Text>
              </View>
            ) : (
              messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  formatTime={formatTime}
                />
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={30}
        enabled={isKeyboardVisible}
      >
        {/* Message Input */}
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isSending={isSending}
          isConnected={isConnected}
          handleSendMessage={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatBox;
