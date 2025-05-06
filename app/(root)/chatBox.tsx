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
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon, CheckIcon } from "react-native-heroicons/outline";
import { icons } from "@/constants";
import { Image } from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";
import { useSocketContext } from "@/context/SocketContext";
import { useUserData } from "@/context/UserContext";

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
  const scrollViewRef = useRef<ScrollView>(null);
  const lastReadUpdate = useRef<number>(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false); // Add this line
  const handleMessageRead = useCallback(
    ({
      conversationId: receivedConversationId,
    }: {
      conversationId: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderType === "USER" ? { ...msg, isRead: true } : msg
        )
      );
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
          { userId : userData?.user_id }
        );
        lastReadUpdate.current = now;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderType === "PHARMACY" ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.log("Read status update failed (non-critical)", error);
    }
  }, [userData?.user_id, conversationId, messages]);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const handleNewMessage = (message: Message) => {
      if (
        message.conversationId === conversationId &&
        message.senderType != "USER"
      ) {
        setMessages((prev) => [...prev, message]);
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

  const fetchMessages = async () => {
    if (!userData?.user_id || !conversationId) return;

    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/messages/fetchMessages`,
        { params: { pharmacyId, userId : userData?.user_id} }
      );

      setMessages(response.data.messages);
      markMessagesAsRead();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchMessages();
    }
  }, [userData?.user_id]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
    markMessagesAsRead();
  }, [messages]);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0 && !initialScrollDone) {
      scrollViewRef.current.scrollToEnd({ animated: false });
      setInitialScrollDone(true);
    } else if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
    markMessagesAsRead();
  }, [messages]);

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

      // Optimistic update
      setMessages((prev) => [...prev, newMessageData]);
      setNewMessage("");

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

      // The socket.io event will handle the real update
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("Error", "Failed to send message");
      // Rollback optimistic update
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

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

  if (isLoading && messages.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
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
        <SafeAreaView style={tw`px-4 flex-1 `}>
          <StatusBar
            backgroundColor="rgb(243 244 246)"
            barStyle="dark-content"
          />

          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (!initialScrollDone) return;
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            overScrollMode="never"
          >
            {messages.length === 0 ? (
              <View className="flex-1 justify-center items-center pt-10">
                <Text className="font-Poppins text-gray-400">
                  No messages yet. Start the conversation!
                </Text>
              </View>
            ) : (
              messages.map((message) => (
                <View
                  key={message.id}
                  className={`flex  mt-2 ${
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
                        message.senderType === "USER"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {message.content}
                    </Text>
                    <View className="flex-row justify-between items-center mt-1">
                      <Text
                        className={`text-xs ${
                          message.senderType === "USER"
                            ? "text-green-100"
                            : "text-gray-400"
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
              ))
            )}
          </ScrollView>
        </SafeAreaView>

        <View className="w-full flex flex-row items-center justify-start gap-2 py-3 px-3 bg-gray-50 border-t border-t-neutral-100">
          <View className="flex-1 flex-row justify-start items-center gap-3.5 bg-white rounded-full h-14 px-4 shadow-sm border border-neutral-100">
            <TextInput
              className="flex-1 font-Montserrat tracking-tight text-gray-800"
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={handleSendMessage}
              multiline
              editable={!isSending}
            />
          </View>

          <TouchableOpacity
            className="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center"
            onPress={handleSendMessage}
            disabled={newMessage.trim() === "" || isSending || !isConnected}
            style={{
              opacity: newMessage.trim() === "" || !isConnected ? 0.5 : 1,
            }}
          >
            {isSending ? (
              <ActivityIndicator color="white" />
            ) : (
              <PaperAirplaneIcon color="white" size={22} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBox;
