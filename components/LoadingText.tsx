import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

interface LoadingTextProps {
  content: string;
  numberOfLines?: number;
  TextclassName?: string;
  isLoading: boolean;
}

const LoadingText = ({ 
  content, 
  numberOfLines, 
  TextclassName, 
  isLoading 
}: LoadingTextProps) => { 
  const textColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading) {
      textColorAnim.setValue(0); // Reset animation when not loading
      return;
    }

    const textAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(textColorAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(textColorAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    );

    textAnimation.start();

    return () => {
      textAnimation.stop();
    };
  }, [textColorAnim, isLoading]);

  const textColor = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#A0A0A0", "#000000"],
  });

  return isLoading ? (
    <Animated.Text 
      className={TextclassName} 
      style={{ color: textColor }} 
      numberOfLines={numberOfLines}
    >
      {content}
    </Animated.Text>
  ) : (
    <Text 
      className={TextclassName} 
      numberOfLines={numberOfLines}
    >
      {content}
    </Text>
  );
};

export default LoadingText;