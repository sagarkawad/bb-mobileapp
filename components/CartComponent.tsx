import React from "react";
import { View, Image, Text } from "react-native";

const CartComponent = ({
  img,
  price,
  name,
}: {
  img: string;
  price: string;
  name: string;
}) => {
  return (
    <View className="rounded flex flex-row justify-between items-center h-40 pr-4 mb-4">
      <Image
        className="w-24 object-cover rounded mb-2"
        source={{ uri: `${img}` }}
      />

      <Text>{name}</Text>
      <View className="flex items-center justify-center h-full">
        <Text className="mb-4">{`Rs. ${price}`}</Text>
        <QuantityComponent />
      </View>
    </View>
  );
};

const QuantityComponent = () => {
  return (
    <View className="flex flex-row border justify-between rounded px-2 w-16 ">
      <Text>-</Text>
      <Text>1</Text>
      <Text>+</Text>
    </View>
  );
};

export default CartComponent;
