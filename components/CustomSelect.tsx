import { TouchableOpacity, Text, View } from "react-native";

import { SelectProps } from "@/types/type";

const CustomSelect = ({
  onPress,
  title,
  description,
  IconLeft,
  IconRight,
  isSelected,
  color,
  className,
  iconAlignment,
  TitleClass,
  DescriptionClass,
  ...props
}: SelectProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full flex flex-row items-center justify-between pr-4 ${className}`}
      {...props}
    >
      <View
        className={`flex flex-row ${
          iconAlignment ? `items-${iconAlignment}` : "items-center"
        } gap-3 w-[75%]`}
      >
        {IconLeft && <IconLeft />}
        <View className="flex flex-col gap-1">
          <Text className={`text-base font-PoppinsMedium  ${TitleClass}`}>
            {title}
          </Text>
          {description && (
            <Text
              className={`text-xs font-PoppinsMedium text-gray-500  ${DescriptionClass}`}
            >
              {description}
            </Text>
          )}
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: isSelected ? color : "rgba(0, 0, 0, 0.25)",
          width: 20,
          height: 20,
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSelected && (
          <View
            style={{
              backgroundColor: color,
              width: 12,
              height: 12,
              borderRadius: 9999,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomSelect;
