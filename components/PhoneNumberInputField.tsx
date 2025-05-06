import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const PhoneNumberInputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (


    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full">
          {label && (
            <Text className={`text-lg font-PoppinsMedium mb-3 ${labelStyle}`}>
              {label}
            </Text>
          )}

          <View
            className={`flex flex-row justify-start items-center relative overflow-hidden bg-neutral-100 rounded-full border border-neutral-200 focus:border-primary-500  ${containerStyle}`}
          >

            <View className="h-full px-6 bg-neutral-200 flex flex-row items-center justify-center">
               <Text className="font-PoppinsMedium text-[17px]">+212</Text>
            </View>
            <TextInput
              className={`rounded-full p-4 pl-6 font-Poppins text-[15px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>

        </View>
      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
};

export default PhoneNumberInputField;
