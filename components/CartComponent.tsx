import React, { useState } from "react";
import { View, Image, Text } from "react-native";
import { cartData } from "@/atoms";
import { useRecoilState } from "recoil";
import { Link } from "expo-router";

const CartComponent = ({
  img,
  price,
  name,
  id,
  quan,
}: {
  img: string;
  price: string;
  name: string;
  id: string;
  quan: string;
}) => {
  return (
    <View className="rounded flex flex-row justify-between items-center h-40 pr-4 mb-4">
      <Image
        className="w-28 h-28 object-cover rounded mb-2"
        source={{
          uri: img,
        }}
      />

      <Text>{name}</Text>
      <View className="flex items-center justify-center h-full">
        <Text className="mb-4">{`Rs. ${Number(price) * Number(quan)}`}</Text>
        <QuantityComponent quan={quan} id={id} />
      </View>
    </View>
  );
};

const QuantityComponent = ({ quan, id }: { quan: string; id: string }) => {
  const [cart, setCart] = useRecoilState(cartData);
  const [quantity, setQuantity] = useState(Number(quan));
  const plus = (id: string) => {
    setCart((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          setQuantity((prevQuantity) => prevQuantity + 1);
          console.log(item);
          console.log(item.quan);
          return { ...item, quan: item.quan + 1 }; // Update quantity
        }
        return item; // Keep other items unchanged
      });
    });
  };

  const minus = (id: string) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id && item.quan > 1) {
          setQuantity((prevQuantity) => prevQuantity - 1);
          return { ...item, quan: item.quan - 1 }; // Update quantity
        }
        return item; // Keep other items unchanged
      });
    });
  };

  return (
    <View className="flex flex-row border justify-between items-center rounded px-2 w-24 ">
      <Text onPress={() => minus(id)} className="text-3xl">
        -
      </Text>
      <Text>{quantity}</Text>
      <Text onPress={() => plus(id)} className="text-3xl">
        +
      </Text>
    </View>
  );
};

export default CartComponent;
