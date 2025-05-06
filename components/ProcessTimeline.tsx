// components/ProcessTimeline.tsx
import React, { useRef, useEffect } from "react";
import { View, Animated, Text } from "react-native";
import tw from "twrnc";
import { processStages } from "@/constants";

interface ProcessTimelineProps {
  stages: typeof processStages;
  currentStageId: string;
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  stages,
  currentStageId,
}) => {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#C0C0C0", "#22C55E"],
  });

  useEffect(() => {
    // Clean up any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Only animate if this is the current stage
    const currentStageIndex = stages.findIndex(
      (stage) => stage.id === currentStageId
    );
    const isCurrent = stages.findIndex(
      (stage) => stage.id === currentStageId
    ) === currentStageIndex;

    if (isCurrent) {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(colorAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      );
      animationRef.current.start();
    } else {
      // Reset to initial state if not current
      colorAnim.setValue(0);
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [currentStageId, colorAnim, stages]);

  const currentStageIndex = stages.findIndex(
    (stage) => stage.id === currentStageId
  );

  return (
    <View className="px-5 flex-col gap-6">
      <View>
        <Text className="font-PoppinsSemiBold text-base">
          {processStages[currentStageIndex]?.title || "Processing"}
        </Text>
        <Text className="font-Poppins text-xs text-gray-400 mt-1">
          {processStages[currentStageIndex]?.description ||
            "Your order is being processed"}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <React.Fragment key={stage.id}>
              {isCurrent ? (
                <Animated.View
                  style={[
                    tw`w-11 h-11 rounded-full items-center justify-center`,
                    { backgroundColor },
                  ]}
                >
                  <stage.icon size={23} color="white" />
                </Animated.View>
              ) : (
                <View
                  style={tw`w-11 h-11 rounded-full items-center justify-center ${
                    isCompleted ? "bg-[#22C55E]" : "bg-neutral-200"
                  }`}
                >
                  <stage.icon
                    size={23}
                    color={isCompleted ? "white" : "#C0C0C0"}
                  />
                </View>
              )}
              {index < stages.length - 1 && (
                <View
                  className={`h-1 flex-1 ${
                    isCompleted ? "bg-[#22C55E]" : "bg-neutral-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default ProcessTimeline;