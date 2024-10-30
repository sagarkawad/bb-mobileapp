import { Stack } from "expo-router/stack";
import { RecoilRoot } from "recoil";
import "../global.css";

export default function Layout() {
  return (
    <RecoilRoot>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(ProductPage)/product"
          options={{
            headerShown: true,
            headerTitle: "Product",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(ProductPage)/cart"
          options={{
            headerShown: true,
            headerTitle: "Cart",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(ProductPage)/order"
          options={{
            headerShown: true,
            headerTitle: "Order",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(user)/signIn"
          options={{
            headerShown: true,
            headerTitle: "Registration and Login",
            headerBackTitle: "back",
          }}
        />
      </Stack>
    </RecoilRoot>
  );
}
