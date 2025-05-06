import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  InteractionManager,
} from "react-native";

interface VerificationCodeInputProps {
  length?: number;
  onCodeChange: (code: string) => void;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 4,
  onCodeChange,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Ensure focus happens after animations/interactions are done
    const focusInput = InteractionManager.runAfterInteractions(() => {
      inputs.current[0]?.focus();
    });

    return () => focusInput.cancel(); // Cleanup on unmount
  }, []);

  const handleTextChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;

    setCode(newCode);
    const fullCode = newCode.join("");
    onCodeChange(fullCode);

    // Auto-focus the next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-row gap-4 items-center justify-center mb-5">
          {Array.from({ length }).map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!)}
              className="w-16 h-16 border border-neutral-200 rounded-lg text-center text-lg"
              keyboardType="numeric"
              maxLength={1}
              value={code[index]}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
            />
          ))}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VerificationCodeInput;
