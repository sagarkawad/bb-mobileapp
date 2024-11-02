import React from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { AddressesState } from "@/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";

const Address = () => {
  const [address, setAddress] = useRecoilState(AddressesState);
  const [userAddress, setUserAddress] = useState("");

  return (
    <View className="flex items-center justify-around bg-red-400 h-full">
      <View>
        <TextInput
          placeholder="Type here..."
          className="text-2xl"
          value={userAddress}
          onChangeText={(newText) => setUserAddress(newText)}
        />
        <View className="mt-10">
          <Button
            title="Add"
            onPress={() => {
              setAddress((prevAddresses) => {
                return [...prevAddresses, { id: userAddress, ad: userAddress }];
              });
              setUserAddress("");
            }}
          />
        </View>
      </View>
      <View className="flex bg-blue-400 justify-center items-center w-full">
        <Text className="text-2xl">Addresses</Text>
        {address ? (
          <FlatList
            data={address}
            renderItem={({ item }) => (
              <View>
                <Text>{item.ad}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          ""
        )}
      </View>
    </View>
  );
};

export default Address;
