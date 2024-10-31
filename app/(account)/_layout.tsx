import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="signin"
        options={{
          headerShown: true,
          headerTitle: "Login and Registration",
          headerBackTitle: "back",
        }}
      />
      <Stack.Screen
        name="address"
        options={{
          headerShown: true,
          headerTitle: "Address",
          headerBackTitle: "back",
        }}
      />
    </Stack>
  );
}
