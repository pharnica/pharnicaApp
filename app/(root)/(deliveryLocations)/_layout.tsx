import { Stack } from "expo-router";


const Layout = () => {

  return (
    <Stack>

      <Stack.Screen
        name="Add_new_address"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="List_of_delivery_locations"
        options={{ headerShown: false, animation: "slide_from_left" }}
      />
     
    </Stack>
  );
};

export default Layout;
