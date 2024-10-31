import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
// import Account from "./../../components/Account";
import { View, Text } from "react-native";
import { Session } from "@supabase/supabase-js";
import { userData } from "@/atoms";
import { useRecoilState } from "recoil";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useRecoilState(userData);

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
      if (session && session.user.email) {
        setUser({ id: session?.user.id, email: session?.user.email });
      }
    });
  }, []);

  return (
    <View>
      <Auth />
      {/* {session && session.user && (
        <Text>
          {session.user.id} {session.user.email}
        </Text>
      )} */}
    </View>
  );
}