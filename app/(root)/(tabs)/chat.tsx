import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import PharmacieProfileChat from "@/components/PharmacieProfileChat";
import { useSocketContext } from "@/context/SocketContext";
import { useUserData } from "@/context/UserContext";

interface Participant {
  id: string;
  name: string;
}

interface LastMessage {
  id: string;
  conversationId: string;
  pharmacyId: string;
  userId?: string;
  content: string;
  senderType: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  participant: Participant;
  lastMessage: LastMessage;
  unreadCount: number;
  updatedAt: string;
}

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocketContext();

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket || !isConnected || !userData?.user_id) return;

    const handleNewMessage = (newMessage: LastMessage) => {
      setConversations((prevConversations) => {
        const existingConvIndex = prevConversations.findIndex(
          (conv) => conv.id === newMessage.conversationId
        );

        let updatedConversations;
        if (existingConvIndex >= 0) {
          // Update existing conversation
          updatedConversations = [...prevConversations];
          const updatedConversation = {
            ...updatedConversations[existingConvIndex],
            lastMessage: newMessage,
            updatedAt: new Date().toISOString(),
            unreadCount:
              newMessage.senderType === "PHARMACY" && !newMessage.isRead
                ? updatedConversations[existingConvIndex].unreadCount + 1
                : updatedConversations[existingConvIndex].unreadCount,
          };

          // Move to top
          updatedConversations.splice(existingConvIndex, 1);
          updatedConversations = [updatedConversation, ...updatedConversations];
        } else {
          // Trigger fetch for new conversation
          fetchConversations(true);
          return prevConversations;
        }

        return updatedConversations;
      });
    };

    const handleMessageRead = ({ conversationId }: { conversationId: string }) => {
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        );
        return updated;
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessageRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessageRead);
    };
  }, [socket, isConnected, userData?.user_id]);

  // Fetch conversations with loading and error states
  const fetchConversations = useCallback(
    async (forceFetch = false) => {
      if (!userData?.user_id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_SERVER_SIDE_API}/api/messages/fetchConversations`,
          {
            params: { userId: userData?.user_id },
            timeout: 10000,
          }
        );

        // Sort by most recent first
        const sortedConversations = (response?.data || []).sort(
          (a: Conversation, b: Conversation) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        setConversations(sortedConversations);
        setFilteredConversations(sortedConversations);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError("Failed to load conversations. Please try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userData?.user_id, isRefreshing]
  );

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [userData?.user_id, fetchConversations]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchConversations(true); // Force fetch on refresh
  }, [fetchConversations]);

  // Filter conversations based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conversation) =>
        conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-gray-100 px-4`}>
        <Text style={tw`text-red-500 font-PoppinsMedium text-lg mb-4`}>{error}</Text>
        <TouchableOpacity
          onPress={() => fetchConversations(true)}
          style={tw`bg-blue-500 px-6 py-3 rounded-full`}
        >
          <Text style={tw`text-white font-PoppinsMedium`}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar animated backgroundColor="rgb(243 244 246)" barStyle="dark-content" />

      <View style={tw`px-4 py-5 flex flex-col gap-5`}>
        <View className="w-full">
          <Text className="font-PoppinsMedium text-2xl pl-1">Chats</Text>
          {!isConnected && (
            <Text className="text-xs text-red-500 font-Poppins">
              Connection lost - reconnecting...
            </Text>
          )}
        </View>

        {/* Search Bar */}
        <View className="flex flex-row justify-between items-center h-[52px] w-full pl-5 pr-2 bg-white rounded-[70px] shadow-sm">
          <View className="flex flex-row justify-start items-center gap-3.5 flex-1">
            <MagnifyingGlassIcon size={22} color="black" strokeWidth={1.6} />
            <TextInput
              className="font-Montserrat tracking-tight text-[#888888] flex-1"
              placeholder="Search pharmacies..."
              placeholderTextColor="#b0b0b0"
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={() => console.log("Search submitted:", searchQuery)}
              clearButtonMode="never"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="pr-2">
                <XMarkIcon color={"#b0b0b0"} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Chat List */}
        <ScrollView
          contentContainerStyle={tw`pb-20`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#22c55e"]}
              tintColor="#22c55e"
            />
          }
        >
          {isLoading && !isRefreshing ? (
            <View style={tw`flex-1 justify-center items-center mt-10`}>
              <ActivityIndicator size="large" color="#22c55e" />
              <Text style={tw`mt-4 text-gray-700 font-Poppins`}>Loading chats...</Text>
            </View>
          ) : filteredConversations.length === 0 ? (
            <View style={tw`flex-1 justify-center items-center mt-10`}>
              <Text style={tw`text-gray-500 font-Poppins`}>
                {searchQuery ? "No matching pharmacies found" : "No conversations yet"}
              </Text>
            </View>
          ) : (
            <View className="flex flex-col gap-6 mt-2">
              {filteredConversations.map((conversation) => (
                <PharmacieProfileChat
                  key={conversation.id}
                  conversationId={conversation.id}
                  pharmacyId={conversation.participant.id}
                  pharmacieName={conversation.participant.name}
                  Message={conversation.lastMessage}
                  unreadMessagesCount={conversation.unreadCount}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Chat;