import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="cart"
        options={{
          headerShown: true,
          headerTitle: "Cart",
          headerBackTitle: "back",
        }}
      />
      <Stack.Screen
        name="order"
        options={{
          headerShown: true,
          headerTitle: "Order",
          headerBackTitle: "back",
        }}
      />
      <Stack.Screen
        name="product"
        options={{
          headerShown: true,
          headerTitle: "Product",
          headerBackTitle: "back",
        }}
      />
    </Stack>
  );
}
