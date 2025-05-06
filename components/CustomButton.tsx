import { TouchableOpacity, Text } from "react-native";
import { images } from "@/constants";
import { ButtonProps } from "@/types/type";
import { Image } from 'expo-image';

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "primary":
      return "bg-green-500";
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-green-500";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-500";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  isLoading,
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  textStyle,
  isDisabled,
  ...props
}: ButtonProps) => {
  const bgStyle = isLoading || isDisabled ? "bg-neutral-300" : getBgVariantStyle(bgVariant);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || isDisabled}
      className={`w-full rounded-full h-16 flex flex-row justify-center items-center shadow-md shadow-neutral-400/50 ${bgStyle} ${className}`}
      {...props}
    >
      {IconLeft && <IconLeft />}
      {!isLoading ? (
        <Text className={`${textStyle ? (textStyle) : ('text-xl')} font-PoppinsMedium ${getTextVariantStyle(textVariant)}`}>
          {title}
        </Text>
      ) : (
        <Image source={images.blackLoader} style={{ width: 56, height: 56 }} />
      )}
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default CustomButton;
