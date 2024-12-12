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

  const addAddresstoDB = async () => {
    if (userInput.trim() === "") {
      Alert.alert("Please enter an Address");
      return;
    }

    // Check for duplicate address
    const isDuplicate = address.some((addr) => addr.ad === userInput.trim());
    if (isDuplicate) {
      Alert.alert("This address already exists.");
      return;
    }

    const { data, error } = await supabase
      .from("address")
      .insert([{ address: userInput, user_id: userSession.id }])
      .select() as {
        data: {id: string, address: string}[] | null,
        error: any
      };

    if (error) {
      Alert.alert(error.message);
    } else {
      alert("Address successfully added");
      setUserInput("");
      if (data && data.length > 0) {
        setAddress(prevAddresses => [
          ...prevAddresses,
          ...data.map((el: {id: string, address: string}) => ({
            id: el.id,
            ad: el.address,
          })),
        ]);
      }
    }
  };

  const removeAddressFromDB = async (id: string) => {
    const { error } = await supabase
      .from("address")
      .delete()
      .eq("id", id);

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Address successfully removed");
      setAddress(prevAddresses => prevAddresses.filter(ad => ad.id !== id));
    }

  }

  const editAddressFromDB = async (id: string) => {
    if (userInput.trim() === "") {
      Alert.alert("Please enter an Address")
      return
    } 

     // Check for duplicate address
     const isDuplicate = address.some((addr) => addr.ad === userInput.trim());
     if (isDuplicate) {
       Alert.alert("This address already exists.");
       return;
     }

    const { data, error } = await supabase
      .from("address")
      .update({ address: userInput })
      .eq("id", id)
      .select() as {
        data: {address: string}[] | null,
        error: any
      };

    if (error) {
      Alert.alert(error.message);
    } else {
      alert("Address successfully edited");
      setUserInput("")
    }
  }

  useEffect(() => {
    async function getFromDB() {
      try {
        const { data, error } = await supabase
          .from("address")
          .select("id, address")
          .eq("user_id", userSession.id) as {
            data: {id: string, address: string}[] | null,
            error: any
          };
        if (error) {
          Alert.alert(error.message);
        } else if (data && data.length != 0) {
          setAddress(
            data.map((el: {id: string, address: string}) => {
              
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
  }, [addAddresstoDB, removeAddressFromDB, editAddressFromDB]);

 

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
                  <View className="flex flex-row justify-between mb-2">
                    <View className="flex flex-row items-center">
                    <RadioButton value={item.ad} />
                    <Text>{item.ad}</Text>
                    </View>
                    <View className="flex flex-row gap-2">
                    <Button onPress={() => {removeAddressFromDB(item.id)}} title="❌"/>
                      <Button onPress={() => {editAddressFromDB(item.id)}} title="✏️"></Button>
                    </View>
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
