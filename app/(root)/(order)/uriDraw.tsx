import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Button,
  TouchableNativeFeedback,
  Alert,
  BackHandler,
} from "react-native";
import { Svg, Path as SvgPath, G, Image as SvgImage } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import useOrderStore from "@/store/orderStore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";
import ReactNativeModal from "react-native-modal";
import CustomButton from "@/components/CustomButton";

// Define types for the paths
interface Point {
  x: number;
  y: number;
}

type PathType = Point[];

const DrawingComponent = ({
  image,
  setShowModalItSelf,
  setPrescriptionList,
  prescriptionList,
}: {
  image: string;
  setShowModalItSelf: any;
  setPrescriptionList: any;
  prescriptionList: any;
}) => {
  const [paths, setPaths] = useState<PathType[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("red");
  const [selectedBrushStoke, setSelectedBrushStoke] = useState<string | number>(
    3
  );
  const [currentPath, setCurrentPath] = useState<PathType>([]);
  const svgRef = useRef<Svg | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPath([{ x: locationX, y: locationY }]);
  };

  const handleTouchMove = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
  };

  const handleTouchEnd = () => {
    if (currentPath.length > 0) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath([]);
    }
  };

  const onSelectColor = ({ hex }: { hex: string }) => {
    setSelectedColor(hex);
  };

  const backAction = useCallback(() => {
    if (paths.length > 0) {  // More accurate condition
      Alert.alert(
        "Hold on!",
        "Are you sure you want to go back and discard the order?",
        [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "Discard", onPress: () => setShowModalItSelf(false) }
        ]
      );
    } else {
      setShowModalItSelf(false);
    }
    return true; // Always prevent default back action
  }, [paths.length, setShowModalItSelf]); // Proper dependencies

  // Focus-aware implementation
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [backAction])
  );
  const handleSave = async () => {
    try {
      if (!svgRef.current) return;

      const uri = await captureRef(svgRef, {
        format: "png",
        quality: 1,
      });

      setPrescriptionList([...prescriptionList, uri]);
      setShowModalItSelf(false);
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save the image.");
    }
  };

  return (
    <GestureHandlerRootView className="w-full h-full z-50">
      <SafeAreaView className="w-full h-full z-50 p-4 bg-gray-100 items-center gap-5">
        <View className="flex flex-row items-center justify-between w-[80%]">
          <TouchableNativeFeedback onPress={backAction}>
            <View className="flex flex-col items-center justify-between gap-2 p-3 rounded-full">
              <FontAwesomeIcon icon={faArrowLeft} size={20} />
              <Text>Back</Text>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback onPress={handleSave}>
            <View className="flex flex-col items-center justify-between gap-2 p-3 rounded-full">
              <FontAwesomeIcon icon={faCheck} size={20} />
              <Text>Done</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={tw`flex w-full h-full items-center gap-20 `}>
          <Svg
            ref={svgRef}
            style={styles.svg}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <SvgImage
              href={{ uri: image }}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
            <G>
              {paths.map((path, index) => (
                <SvgPath
                  key={index}
                  d={path
                    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
                    .join(" ")}
                  stroke={selectedColor}
                  strokeWidth={selectedBrushStoke}
                  fill="none"
                />
              ))}
              <SvgPath
                d={currentPath
                  .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
                  .join(" ")}
                stroke={selectedColor}
                strokeWidth={selectedBrushStoke}
                fill="none"
              />
            </G>
          </Svg>

          <View className="rounded-full flex flex-row items-center justify-between pl-2 pr-3 py-2 gap-10 bg-black">
            <View className="flex flex-row gap-1">
              <TouchableOpacity
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  selectedBrushStoke === 7 ? "bg-white/30" : ""
                }`}
                onPress={() => setSelectedBrushStoke(7)}
              >
                <View className="w-7 h-7 bg-white rounded-full"></View>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  selectedBrushStoke === 5 ? "bg-white/30" : ""
                }`}
                onPress={() => setSelectedBrushStoke(5)}
              >
                <View className="w-5 h-5 bg-white rounded-full"></View>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  selectedBrushStoke === 3 ? "bg-white/30" : ""
                }`}
                onPress={() => setSelectedBrushStoke(3)}
              >
                <View className="w-3 h-3 bg-white rounded-full"></View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="rounded-full h-8 w-8 border border-white flex items-center justify-center"
              onPress={() => setShowModal(true)}
            >
              <View
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ReactNativeModal isVisible={showModal}>
          <View className="bg-white px-7 py-6 rounded-2xl min-h-[300px] items-center">
            <ColorPicker
              style={tw`w-[100%]`}
              value={selectedColor}
              onComplete={onSelectColor}
            >
              <Preview />
              <Panel1 />
              <HueSlider />
              <OpacitySlider />

              <CustomButton
                title="change"
                onPress={() => setShowModal(false)}
                className="mt-10"
              />
            </ColorPicker>
          </View>
        </ReactNativeModal>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  svg: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
    backgroundColor: "#dadada",
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#c1c1c1",
  },
});

export default DrawingComponent;
