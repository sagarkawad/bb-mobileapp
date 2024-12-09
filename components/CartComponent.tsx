import React, { useState, useEffect } from "react";
import { View, Image, Text, Alert } from "react-native";
import { cartDataState, userDataState } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { supabase } from "@/lib/supabase";

interface CartItem {
  id: string;
  quan: number;
  user_id: string;
  name: string;
  price: string;
  desc: string;
  img: string;
  quantity?: number;
}

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
  const [cart, setCart] = useRecoilState(cartDataState);
  const [quantity, setQuantity] = useState(Number(quan));
  const userSession = useRecoilValue(userDataState);

  const plus = (id: string) => {
    setCart((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          setQuantity((prevQuantity) => prevQuantity + 1);
          console.log(item);
          console.log(item.quan);

          const updateDbPlus = async () => {
            const { data, error } = await supabase
              .from("cart")
              .update({ quantity: item.quan + 1 })
              .eq("user_id", userSession.id)
              .select();
            if (error) {
              Alert.alert(error.message);
              return item;
            }
          };
          updateDbPlus();

          return { ...item, quan: item.quan + 1 }; // Update quantity
        }
        return item; // Keep other items unchanged
      });
    });
  };

  const minus = (id: string) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && item.quan > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
            const updateDbMinus = async () => {
              const { data, error } = await supabase
                .from("cart")
                .update({ quantity: item.quan - 1 })
                .eq("user_id", userSession.id)
                .select();
              if (error) {
                Alert.alert(error.message);
                return item;
              }
            };
            updateDbMinus();
            return { ...item, quan: item.quan - 1 }; // Update quantity
          } else if (item.id === id && item.quan === 1) {
            const removeFromDb = async () => {
              const { data, error } = await supabase
                .from("cart")
                .delete()
                .eq("user_id", userSession.id)
                .eq("id", item.id);
              if (error) {
                Alert.alert(error.message);
                return;
              }
            };
            removeFromDb();
            return null; // This item will be filtered out
          }
          return item; // Keep other items unchanged
        })
        .filter(Boolean); // Remove null values from the array
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
