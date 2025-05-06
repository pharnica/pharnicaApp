import home from "@/assets/icons/home.png";
import hospital from "@/assets/icons/hospital.png";
import Activehome from "@/assets/icons/Activehome.png";
import WhiteScanner from "@/assets/icons/scanner.png";
import BlackScanner from "@/assets/icons/scanBlack.png";
import check from "@/assets/images/check.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import blackLoader from "@/assets/icons/loader-black.gif";
import whiteLoader from "@/assets/icons/loader-white.gif";
import google from "@/assets/icons/google.png";
import prescription from "@/assets/icons/prescription.png";
import mapPin from "@/assets/icons/mapPin.png";
import gender from "@/assets/icons/gender.png";
import activepin from "@/assets/icons/activepin.png";
import door from "@/assets/icons/doorWand.png";
import doorBlack from "@/assets/icons/doorBlack.png";
import doorActive from "@/assets/icons/door.png";
import building from "@/assets/icons/buildingWand.png";
import buildingActive from "@/assets/icons/building.png";
import crossHair from "@/assets/icons/crosshairWand.png";
import crossHairActive from "@/assets/icons/crosshair.png";
import magicStick from "@/assets/icons/magicWand.png";
import magicStickActive from "@/assets/icons/magic.png";
import idCard from "@/assets/icons/idCard.png";
import locationMap from "@/assets/icons/location.png";

import inactivePharmacy from "@/assets/icons/inactivePharmacy.png";
import SelectedPharmacy from "@/assets/icons/SelectedPharmacy.png";
import activePharmacy from "@/assets/icons/activePharmacy.png";
import pendingPharmacy from "@/assets/icons/PendingPharmacy.png";
import rejectedPharmacy from "@/assets/icons/rejectedPharmacy.png";


import GPS from "@/assets/icons/GPS.png";
import priceConfirmation from "@/assets/images/Frame 60545.png";

import fever from "@/assets/images/fever.png";
import digestive from "@/assets/images/gastrointestinal-tract.png";
import drugs from "@/assets/images/drugs.png";
import pregnant from "@/assets/images/pregnant.png";
import aid from "@/assets/images/first-aid-kit.png";
import baby from "@/assets/images/baby.png";
import care from "@/assets/images/face-mask.png";
import adults from "@/assets/images/sex.png";
import { CheckCircleIcon, CubeIcon, CurrencyDollarIcon, ShieldCheckIcon, TruckIcon } from "react-native-heroicons/outline";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  check,
  noResult,
  message,
  blackLoader,
  whiteLoader,
  priceConfirmation,
  fever,
  digestive,
  drugs,
  pregnant,
  aid,
  baby,
  care,
  adults,
};

export const icons = {

  home,
  hospital,
  Activehome,
  WhiteScanner,
  BlackScanner,
  google,
  prescription,
  mapPin,
  activepin,
  door,
  doorBlack,
  doorActive,
  building,
  buildingActive,
  crossHair,
  crossHairActive,
  magicStick,
  magicStickActive,
  gender,
  idCard,
  locationMap,
  inactivePharmacy,
  SelectedPharmacy,
  activePharmacy,
  pendingPharmacy,
rejectedPharmacy,
  GPS,
};

export const processStages = [
    {
      id: "VALIDATING",
      title: "Order Validating",
      description:
        "The pharmacy has received your order and is currently being processed",
      icon: ShieldCheckIcon,
    },
    {
      id: "PRICE_CALCULATING",
      title: "Total Price Calculating",
      description: "The pharmacy is calculating the total price",
      icon: CurrencyDollarIcon,
    },
    {
      id: "PREPARING",
      title: "Packaging . . .",
      description: "Your items are being carefully packed",
      icon: CubeIcon,
    },
    {
      id: "SHIPPING",
      title: "Shipped",
      description: "Your package is on its way to you",
      icon: TruckIcon,
    },
    {
      id: "DELIVERED",
      title: "Delivered",
      description: "Your order has been successfully delivered",
      icon: CheckCircleIcon,
    },
  ];

const categories = [
    { title: "Pain &\nFever", from: images.fever },
    { title: "Digestive\nHealth", from: images.digestive },
    { title: "Vitamins &\npain killers", from: images.drugs },
    { title: "Women's\nHealth", from: images.pregnant },
    { title: "First aid\nsupplies", from: images.aid },
    { title: "Babies\ngear", from: images.baby },
    { title: "Personal\nCare", from: images.care },
    { title: "Sexual\nhealth", from: images.adults },
  ];

export const onboarding = [
  {
    id: 1,
    title: "The perfect ride is just a tap away!",
    description:
      "Your journey begins with Ryde. Find your ideal ride effortlessly.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Best car in your hands with Ryde",
    description:
      "Discover the convenience of finding your perfect ride with Ryde",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Your ride, your way. Let's go!",
    description:
      "Enter your destination, sit back, and let us take care of the rest.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};

export const customMapStyle = [
  {
    featureType: "poi", // Points of interest (malls, mosques, etc.)
    elementType: "labels",
    stylers: [{ visibility: "off" }], // Hide labels for points of interest
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ visibility: "on" }], // Hide geometry for points of interest
  },
  {
    featureType: "road", // Roads
    elementType: "labels",
    stylers: [{ visibility: "off" }], // Hide road labels (including yellow rectangles)
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }], // Show road geometry (the actual road lines)
  },
];
