import React, { useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { addressesState, selectedAddressState, userDataState } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import { supabase } from "@/lib/supabase";

const Address = () => {
  const [address, setAddress] = useRecoilState(addressesState);
  const [selectedAddress, setSelectedAddress] =
    useRecoilState(selectedAddressState);
  const userSession = useRecoilValue(userDataState);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    async function getFromDB() {
      try {
        const { data, error } = await supabase
          .from("address")
          .select("id, address")
          .eq("user_id", userSession.id);
        if (error) {
          Alert.alert(error.message);
        } else if (data.length != 0) {
          setAddress(
            data.map((el) => {
              //@ts-ignore
              return { id: el.id, ad: el.address };
            })
          );
        }
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }

    getFromDB();
  }, []);

  const addAddresstoDB = async () => {
    const { data, error } = await supabase
      .from("address")
      .insert([{ address: userInput, user_id: userSession.id }])
      .select();

    if (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View className="flex h-full justify-around p-4">
      <View>
        <TextInput
          placeholder="Type here..."
          className="text-2xl"
          value={userInput}
          onChangeText={(newText) => setUserInput(newText)}
        />
        <View className="mt-14">
          <Button
            title="Add"
            onPress={() => {
              addAddresstoDB();
              setAddress((prevAddresses) => {
                return [...prevAddresses, { id: userInput, ad: userInput }];
              });
              setUserInput("");
            }}
          />
        </View>
      </View>
      <View>
        <Text className="text-2xl">Saved Addresses</Text>
        {address ? (
          <View>
            <RadioButton.Group
              onValueChange={(newValue) => setSelectedAddress(newValue)}
              value={selectedAddress}
            >
              <FlatList
                data={address}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton value={item.ad} />
                    <Text>{item.ad}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </RadioButton.Group>
          </View>
        ) : (
          ""
        )}
      </View>
    </View>
  );
};

export default Address;
