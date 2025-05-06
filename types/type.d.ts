import { TextInputProps, TouchableOpacityProps } from "react-native";


declare interface ButtonProps extends TouchableOpacityProps {
  isLoading?:boolean;
  isDisabled?:boolean;
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  textStyle?: string;
}

declare interface SelectProps extends TouchableOpacityProps {
  isLoading?: boolean;
  color: string;
  iconAlignment?: string;
  title: string;
  description?: string;
  isSelected: boolean;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  TitleClass?: string;
  DescriptionClass?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}



export interface Pharmacy {
  id: string;
  address: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  name: string;
  orderStatus: string;
}


