import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import { View, Text } from "react-native";
import { Session } from "@supabase/supabase-js";
import { userDataState } from "@/atoms";
import { useRecoilState } from "recoil";
import { useRouter } from "expo-router";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useRecoilState(userDataState);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && session.user.email) {
        setUser({ id: session?.user.id, email: session?.user.email });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log(session);
      console.log("onauthstate change called");
      console.log(_event);
      console.log(session?.user.id);
      console.log(session?.user.email);

      if (session && session.user.email) {
        setUser({
          id: session?.user.id,
          email: session?.user.email,
        });
      }
    });
  }, []);

  return (
    <View>
      <Auth router={router} />
    </View>
  );
}
