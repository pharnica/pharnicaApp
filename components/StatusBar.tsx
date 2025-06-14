import { View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

const StatusBar = ({ 
  statusList, 
  currentStatusIndex,
  status,
  stop
}: {
  statusList: any[],
  currentStatusIndex: number,
  status: string
  stop:boolean
}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'CANCELLED' || status === 'DELIVERED') {
      animation.stopAnimation();
      return;
    }

    if (currentStatusIndex < statusList.length - 1) {
      startAnimation();
    } else {
      animation.stopAnimation();
    }
  }, [currentStatusIndex, status]);

  const startAnimation = () => {
    animation.setValue(0);
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      })
    ]).start(({ finished }) => {
      if (finished) {
        startAnimation();
      }
    });
  };

  const interpolatedWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (status === 'CANCELLED' || stop) {
    return <View className='w-full h-1 bg-red-500 rounded-full' ></View>;
  }

  if (status === 'DELIVERED') {
    return <View className='w-full h-1 bg-[#22C55E] rounded-full' />;
  }

  return (
    <View className='flex flex-row items-center justify-center gap-2'>
      {statusList.map((stt, index) => {
        if (stt.status === 'CANCELLED') return null;
        
        let bgColor = 'bg-gray-300 ';
        let isCurrent = index === currentStatusIndex;

        if (index < currentStatusIndex) bgColor = 'bg-[#22C55E]'; 
        if (isCurrent) bgColor = 'bg-[#22C55E]/20'; 

        return (
          <View 
            className={`flex-1 h-1 ${bgColor} rounded-full overflow-hidden`} 
            key={index}
          >
            {isCurrent && (
              <Animated.View 
                className="h-full bg-[#22C55E] rounded-full absolute top-0 left-0"
                style={{
                  width: interpolatedWidth,
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default StatusBar;