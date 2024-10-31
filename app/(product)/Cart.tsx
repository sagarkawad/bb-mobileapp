import { View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { cartData } from "@/atoms";
import CartComponent from "@/components/CartComponent";
import { Link } from "expo-router";
import { useState } from "react";

const Cart = () => {
  const cart = useRecoilValue(cartData);

  return (
    <View className="flex justify-between p-4 h-full ">
      <View>
        {cart &&
          cart.map(
            (el: {
              img: string;
              price: string;
              name: string;
              quan: number;
              id: string;
            }) => (
              <CartComponent
                key={el.name}
                img={el.img}
                price={el.price}
                name={el.name}
                quan={`${el.quan}`}
                id={el.id}
              />
            )
          )}
      </View>
      <View>
        <View>
          <Text>
            Total = Rs.{" "}
            {cart.reduce((sum, el) => {
              return sum + Number(el.price) * el.quan;
            }, 0)}
          </Text>
        </View>
        <View className="bg-blue-400 rounded flex items-center justify-center h-10">
          <Link href="./Order">
            <Text className="text-white">Proceed To Checkout</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Cart;
