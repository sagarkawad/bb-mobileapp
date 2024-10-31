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
          name="(product)/Product"
          options={{
            headerShown: true,
            headerTitle: "Product",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(product)/Cart"
          options={{
            headerShown: true,
            headerTitle: "Cart",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(product)/Order"
          options={{
            headerShown: true,
            headerTitle: "Order",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(user)/SignIn"
          options={{
            headerShown: true,
            headerTitle: "Registration and Login",
            headerBackTitle: "back",
          }}
        />
        <Stack.Screen
          name="(user)/Address"
          options={{
            headerShown: true,
            headerTitle: "Address",
            headerBackTitle: "back",
          }}
        />
      </Stack>
    </RecoilRoot>
  );
}
