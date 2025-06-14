import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/solid";


const ChatInput: React.FC<{
  newMessage: string;
  setNewMessage: (text: string) => void;
  isSending: boolean;
  isConnected: boolean;
  handleSendMessage: () => void;
}> = ({ newMessage, setNewMessage, isSending, isConnected, handleSendMessage }) => (
  <View className="w-full flex flex-row items-center justify-start gap-2 py-3 px-3">
    <View className="flex-1 flex-row justify-start items-center gap-3.5 bg-white rounded-full h-14 px-4 shadow-sm shadow-neutral-300 border border-neutral-100">
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
);


export default ChatInput