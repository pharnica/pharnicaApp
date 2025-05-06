import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StatusBar,
  Pressable,
  Alert,
  BackHandler,
  TouchableHighlight,
  Modal,
  TouchableNativeFeedback,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import useOrderStore from "@/store/orderStore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCrop,
  faPen,
  faRotate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "react-native-heroicons/outline";
import * as ImageManipulator from "expo-image-manipulator";
import DrawingComponent from "./uriDraw";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { ImageEditor } from "expo-image-editor";
import { router } from "expo-router";

const Order = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const {
    prescriptions,
    currentPrescIndex,
    popPrescriptions,
    addPrescription,
    modifyPrescription,
  } = useOrderStore();

  const [prescriptionList, setPrescriptionList] = useState([
    prescriptions[currentPrescIndex],
  ]);

  const [currentEditionIndex, setCurrentEditionIndex] = useState(
    prescriptionList.length - 1
  );

  // Memoize the current image URI to prevent unnecessary re-renders
  const currentImageUri = useMemo(
    () => prescriptionList[currentEditionIndex],
    [prescriptionList, currentEditionIndex]
  );

  // Optimize image manipulation with useCallback and better error handling
  const handleImageManipulation = useCallback(
    async (actions: ImageManipulator.Action[]) => {
      if (isProcessing) return; // Prevent multiple simultaneous operations

      setIsProcessing(true);
      try {
        const result = await ImageManipulator.manipulateAsync(
          currentImageUri,
          actions,
          {
            compress: 0.8, // Slightly reduce quality for better performance
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false, // Don't generate base64 unless needed
          }
        );

        setPrescriptionList((prev) => [...prev, result.uri]);
      } catch (error) {
        console.error("Error processing image:", error);
        Alert.alert("Error", "Failed to process image.");
      } finally {
        setIsProcessing(false);
      }
    },
    [currentImageUri, isProcessing]
  );

  const handleShowCropEditor = useCallback(() => {
    setIsEditorReady(false); // Reset editor state
    setShowModal2(true);
    // Small delay to ensure modal is fully mounted before showing editor
    setTimeout(() => {
      setIsEditorReady(true);
    }, 100);
  }, []);

  // Handle editor close
  const handleEditorClose = useCallback(() => {
    setIsEditorReady(false);
    setShowModal2(false);
  }, []);

  // Handle crop completion
  const handleCropComplete = useCallback((result: any) => {
    setPrescriptionList((prev) => [...prev, result.uri]);
    handleEditorClose();
  }, []);

  // Memoize common operations
  const handleRotate = useCallback(() => {
    handleImageManipulation([{ rotate: 90 }]);
  }, [handleImageManipulation]);

  const handleFlipHorizontal = useCallback(() => {
    handleImageManipulation([{ flip: ImageManipulator.FlipType.Horizontal }]);
  }, [handleImageManipulation]);

  const handleFlipVertical = useCallback(() => {
    handleImageManipulation([{ flip: ImageManipulator.FlipType.Vertical }]);
  }, [handleImageManipulation]);

  // Optimize back action handler
  const backAction = useCallback(() => {
    if (prescriptionList.length > 1) {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to go back and discard the order?",
        [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          {
            text: "Discard",
            onPress: () => {
              const img = prescriptions[0];
              popPrescriptions();
              addPrescription(img);
              router.back()
            },
          },
        ]
      );
    } else {
      router.back()
    }
    return true; // Always prevent default back action
  }, [prescriptionList.length, prescriptions, popPrescriptions, addPrescription, navigation]);

  // Proper focus-aware back handler
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [backAction])
  );

  useEffect(() => {
    setCurrentEditionIndex(prescriptionList.length - 1);
  }, [prescriptionList]);

  // Memoize save handler
  const handleSave = useCallback(() => {
    if (prescriptionList.length === 1) {
      Alert.alert(
        "Hold on!",
        "There are no changes to save, are you sure you want to go back?",
        [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          {
            text: "Discard",
            onPress: () => router.back()
          },
        ]
      );
    } else {
      Alert.alert("Hold on!", "Are you sure you want to save this?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        {
          text: "Apply",
          onPress: () => {
            modifyPrescription(
              currentPrescIndex,
              prescriptionList[prescriptionList.length - 1]
            );
            router.back()
          },
        },
      ]);
    }
  }, [
    prescriptionList.length,
    currentPrescIndex,
    modifyPrescription,
    navigation,
  ]);

  // Memoize navigation buttons state
  const canUndo = currentEditionIndex > 0;
  const canRedo = currentEditionIndex < prescriptionList.length - 1;

  // Render optimized image component
  const renderImage = useMemo(
    () => (
      <Image
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
          backgroundColor: "#dadada",
          borderRadius: 10,
        }}
        contentFit="contain"
        source={{ uri: currentImageUri }}
        cachePolicy="memory-disk"
      />
    ),
    [currentImageUri]
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 bg-gray-100 py-4 px-4">
        <StatusBar
          animated
          backgroundColor="rgb(243 244 246)"
          barStyle="dark-content"
        />

        <View className="w-full mb-6 flex flex-row items-center justify-between">
          <View className="flex flex-row items-center justify-center gap-4">
            <Pressable
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
              onPress={backAction}
            >
              <ArrowLeftIcon size={20} color="black" className="m-4"  strokeWidth={2}/>
            </Pressable>

            <Text className="text-xl ml-2 font-PoppinsMedium">Prescription</Text>
          </View>

          <View className="flex flex-row items-center justify-center gap-2">
            <TouchableNativeFeedback
              onPress={() => setCurrentEditionIndex((prev) => prev - 1)}
              disabled={!canUndo}
            >
              <View
                className={`flex flex-col items-center justify-center w-10 h-10 rounded-full ${
                  !canUndo ? "bg-gray-200" : "bg-white"
                }`}
              >
                <ArrowUturnLeftIcon
                  size={20}
                  color={canUndo ? "black" : "gray"}
                  className="m-4"
                />
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
              onPress={() => setCurrentEditionIndex((prev) => prev + 1)}
              disabled={!canRedo}
            >
              <View
                className={`flex flex-col items-center justify-center ${
                  !canRedo ? "bg-gray-200" : "bg-white"
                } w-10 h-10 rounded-full`}
              >
                <ArrowUturnRightIcon
                  size={20}
                  color={canRedo ? "black" : "gray"}
                  className="m-4"
                />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

        <ScrollView contentContainerClassName="flex-grow w-full items-center justify-between h-full">
          <View className="w-full h-[400px] items-center justify-center rounded-md">
            {renderImage}
          </View>

          <View className="flex items-center gap-4">
            <View className="w-full rounded-full flex flex-row items-center justify-between py-5 px-7 bg-black">
              <TouchableHighlight
                className="rounded-full flex items-center justify-center h-5 w-5"
                onPress={handleShowCropEditor}
                disabled={isProcessing}
              >
                <FontAwesomeIcon
                  icon={faCrop}
                  size={20}
                  color={isProcessing ? "gray" : "white"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                className="rounded-full flex items-center justify-center h-5 w-5"
                onPress={handleRotate}
                disabled={isProcessing}
              >
                <FontAwesomeIcon
                  icon={faRotate}
                  size={20}
                  color={isProcessing ? "gray" : "white"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                className="rounded-full flex items-center justify-center h-5 w-5"
                onPress={() => setShowModal(true)}
                disabled={isProcessing}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  size={20}
                  color={isProcessing ? "gray" : "white"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                className="rounded-full flex items-center justify-center h-5 w-5"
                onPress={handleFlipHorizontal}
                disabled={isProcessing}
              >
                <MaterialCommunityIcons
                  name="reflect-horizontal"
                  size={20}
                  color={isProcessing ? "gray" : "white"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                className="rounded-full flex items-center justify-center h-5 w-5"
                onPress={handleFlipVertical}
                disabled={isProcessing}
              >
                <MaterialCommunityIcons
                  name="reflect-vertical"
                  size={20}
                  color={isProcessing ? "gray" : "white"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                className="rounded-full flex items-center justify-center h-5 w-5"
                onPress={() => setCurrentEditionIndex(0)}
                disabled={isProcessing}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size={20}
                  color={isProcessing ? "gray" : "white"}
                />
              </TouchableHighlight>
            </View>

            <Pressable
              className={`w-full py-[14px] px-6 ${
                isProcessing ? "bg-gray-400" : "bg-green-500"
              } rounded-full flex items-center justify-center`}
              onPress={handleSave}
              disabled={isProcessing}
            >
              <Text className="text-[16px] text-white font-medium">
                {isProcessing ? "Processing..." : "Save and return"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <Modal visible={showModal} animationType="slide">
         
            <DrawingComponent
              setPrescriptionList={setPrescriptionList}
              prescriptionList={prescriptionList}
              setShowModalItSelf={setShowModal}
              image={currentImageUri}
            />
          
        </Modal>

        <Modal
          visible={showModal2}
          animationType="fade"
          onShow={() => setIsEditorReady(true)}
        >
          {isEditorReady && (
            <ImageEditor
              visible={true}
              onCloseEditor={handleEditorClose}
              imageUri={currentImageUri}
              fixedCropAspectRatio={9 / 16}
              minimumCropDimensions={{
                width: 100,
                height: 100,
              }}
              onEditingComplete={handleCropComplete}
              mode="crop-only"
              allowedTransformOperations={["crop", "rotate"]}
            />
          )}
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Order;
