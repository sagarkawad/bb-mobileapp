import React from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { AddressesState, SelectedAddressState } from "@/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { RadioButton } from "react-native-paper";

const Address = () => {
  const [address, setAddress] = useRecoilState(AddressesState);
  const [selectedAddress, setSelectedAddress] =
    useRecoilState(SelectedAddressState);
  const [userInput, setUserInput] = useState("");

  return (
    <View className="flex  h-full justify-around p-4">
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
              setAddress((prevAddresses) => {
                return [...prevAddresses, { id: userInput, ad: userInput }];
              });
              setUserInput("");
            }}
          />
        </View>
      </View>
      <View>
        <Text className="text-2xl">Addresses</Text>
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
