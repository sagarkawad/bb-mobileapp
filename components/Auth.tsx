import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { supabase } from "../lib/supabase";
import {  Input } from "@rneui/themed";
import { Button } from "react-native-paper";

export default function Auth({ router }: { router: any }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace("/");
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          email,
          first_name: name,
          age: age,
        },
      },
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("User Registered Successfully");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Name"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Username"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Age"
          leftIcon={{ type: "font-awesome", name: "calendar" }}
          onChangeText={(text) => setAge(text)}
          value={age}
          placeholder="Age"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        
        <Button mode="contained" onPress={() => signUpWithEmail()} style={styles.checkoutButton}
          labelStyle={styles.buttonText}>
          Sign Up
          </Button>
      </View>
      <View style={styles.verticallySpaced}>
       
        <Button mode="contained" onPress={() => signInWithEmail()} style={styles.checkoutButton}
          labelStyle={styles.buttonText}>
          Sign In
          </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
    marginTop: 4,
  },
  mt20: {
    marginTop: 20,
  },
  checkoutButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  }
});
