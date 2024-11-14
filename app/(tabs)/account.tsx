import { View, Text, Button, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import { userDataState } from "@/atoms";
import { useEffect, useState } from "react";

const Account = () => {
  const router = useRouter();
  const [userDataSession, setUserDataSession] = useRecoilState(userDataState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        setUserDataSession({
          id: session?.user.id,
          email: session?.user.email,
        });
      }
    });
    setLoading(false);
  }, []);

  const pushToSignIn = () => {
    router.push("./../(account)/signin");
  };

  const pushToSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("error:", error);
      Alert.alert("error : Couldn't sign out!");
    }
    setUserDataSession({ id: null, email: null });
  };

  return (
    <View className="p-4">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {userDataSession.id ? (
            <Link href="./../(account)/address" className="mb-10">
              <View className="h-16 border-b flex flex-row items-center justify-between mb-10">
                <View>
                  <Text className="text-2xl">Addresses</Text>
                </View>
                <View>
                  <Text>{">"}</Text>
                </View>
              </View>
            </Link>
          ) : (
            ""
          )}

          {userDataSession.id ? (
            <Text>You are signed in as: {userDataSession.email}</Text>
          ) : (
            ""
          )}
          <Button
            title={userDataSession.id ? "SignOut" : "SignIn"}
            onPress={userDataSession.id ? pushToSignOut : pushToSignIn}
          />
        </>
      )}
    </View>
  );
};

export default Account;
