import { View, Text, Button, Alert, FlatList } from "react-native";
import { RadioButton } from "react-native-paper";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  addressesState,
  selectedAddressState,
  userDataState,
  cartDataState,
} from "@/atoms";
import { useRouter } from "expo-router";

const Order = () => {
  const [value, setValue] = useState("pod");
  const [address, setAddress] = useRecoilState(addressesState);
  const [selectedAddress, setSelectedAddress] =
    useRecoilState(selectedAddressState);
  const user = useRecoilValue(userDataState);
  const cart = useRecoilValue(cartDataState);
  const router = useRouter();

  //session.id;
  //{ user_id: user.id, address: address }

  const placeOrder = async () => {
    if (value === "pp") {
      Alert.alert("Razorpay currently is in development phase!");
      return;
    } else if (selectedAddress === "") {
      Alert.alert("Address not selected!");
      return;
    }
    const { data, error } = await supabase
      .from("orders")
      .insert(
        cart.map((el) => {
          return {
            user_id: user.id,
            address: selectedAddress,
            product: el.id,
            quantity: el.quan,
          };
        })
      )
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
