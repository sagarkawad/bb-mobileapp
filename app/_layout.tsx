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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(index)" options={{ headerShown: false }} />
        <Stack.Screen name="(account)" options={{ headerShown: false }} />
      </Stack>
    </RecoilRoot>
  );
}
