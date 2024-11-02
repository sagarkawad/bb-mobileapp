import { View, Text, Button, Alert, FlatList } from "react-native";
import { RadioButton } from "react-native-paper";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import { AddressesState, SelectedAddressState, userDataState } from "@/atoms";
import { useRouter } from "expo-router";

const Order = () => {
  const [value, setValue] = useState("pod");
  const [address, setAddress] = useRecoilState(AddressesState);
  const [selectedAddress, setSelectedAddress] =
    useRecoilState(SelectedAddressState);
  const user = useRecoilValue(userDataState);
  const router = useRouter();

  //session.id;

  const placeOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .insert([{ user_id: user.id, address: address }])
      .select();

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Order successfully placed!");
      router.replace("/");
    }
  };

  return (
    <View className="p-4 flex h-full justify-between">
      <View>
        <View className="mb-10">
          <Text className="text-3xl mb-4">Mode of Payment</Text>
          <RadioButton.Group
            onValueChange={(newValue) => setValue(newValue)}
            value={value}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="pod" />
              <Text>Pay on Delivery</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="pp" />
              <Text>RazorPay</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View>
          <Text className="text-3xl mb-4">Address</Text>
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
      </View>
      <View>
        <Button title="Place Order" onPress={placeOrder} />
      </View>
    </View>
  );
};

export default Order;
