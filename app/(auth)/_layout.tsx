import { Stack } from "expo-router";


const Layout = () => {

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="signUpPhoneNumber"
        options={{ headerShown: false, animation: "slide_from_left" }}
      />
      <Stack.Screen
        name="signInPhoneNumber"
        options={{ headerShown: false, animation: "slide_from_left" }}
      />
    </Stack>
  );
};

export default Layout;
