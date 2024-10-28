import { View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { cartData } from "@/atoms";
import CartComponent from "@/components/CartComponent";

const cart = () => {
  const cart = useRecoilValue(cartData);
  return (
    <View className="p-4">
      {cart &&
        cart.map((el: { img: string; price: string; name: string }) => (
          <CartComponent
            key={el.name}
            img={el.img}
            price={el.price}
            name={el.name}
          />
        ))}
    </View>
  );
};

export default cart;
