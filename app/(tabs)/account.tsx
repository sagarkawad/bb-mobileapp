import { View, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import { userDataState } from "@/atoms";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";

const Account = () => {
  const router = useRouter();
  const [userDataSession, setUserDataSession] = useRecoilState(userDataState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email) {
        setUserDataSession({
          id: session?.user.id,
          email: session?.user.email,
        });
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  const handleSignIn = () => router.push("./../(account)/signin");

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "Couldn't sign out!");
    } else {
      setUserDataSession({ id: null, email: null });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : (
        <>
          {userDataSession.id ? (
            <Link href="./../(account)/address" style={styles.linkContainer}>
              <View style={styles.linkContent}>
                <Text style={styles.linkText}>Addresses</Text>
                <Text style={styles.arrow}>›
                </Text>
              </View>
            </Link>
          ) : null}

          {userDataSession.id ? (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoText}>Signed in as: {userDataSession.email}</Text>
            </View>
          ) : null}

          <Button
            mode="contained"
            onPress={userDataSession.id ? handleSignOut : handleSignIn}
            style={styles.actionButton}
            labelStyle={styles.buttonText}
          >
            {userDataSession.id ? "Sign Out" : "Sign In"}
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  linkContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  linkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#888',
  },
  userInfoContainer: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Account;
