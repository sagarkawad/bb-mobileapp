import { View, Text, Alert, FlatList, StyleSheet } from "react-native";
import { RadioButton, Button } from "react-native-paper";
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
  const [selectedAddress, setSelectedAddress] = useRecoilState(selectedAddressState);
  const user = useRecoilValue(userDataState);
  const [cart, setCart] = useRecoilState(cartDataState);
  const router = useRouter();

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
            product_id: el.id,
            quantity: el.quan,
            total_price: el.quan * Number(el.price),
          };
        })
      )
      .select();

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Order successfully placed!");
      const { error: cartError } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);
      if (cartError) {
        Alert.alert(cartError.message);
        return;
      }
      setCart([]);
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Mode of Payment</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setValue(newValue)}
          value={value}
        >
          <View style={styles.radioButtonContainer}>
            <RadioButton value="pod" />
            <Text style={styles.radioButtonText}>Pay on Delivery</Text>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton value="pp" />
            <Text style={styles.radioButtonText}>RazorPay</Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.sectionTitle}>Address</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setSelectedAddress(newValue)}
          value={selectedAddress}
        >
          <FlatList
            data={address}
            renderItem={({ item }) => (
              <View style={styles.addressItem}>
                <RadioButton value={item.ad} />
                <Text style={styles.addressText}>{item.ad}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </RadioButton.Group>
      </View>

      <View >
        <Button mode="contained" onPress={placeOrder} style={styles.checkoutButton}
          labelStyle={styles.buttonText}>
          Place Order
          </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
  },
  paymentSection: {
    marginBottom: 20,
  },
  addressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioButtonText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addressText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
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

export default Order;
