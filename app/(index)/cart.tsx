import { View, Text, Alert } from "react-native";
import { useRecoilValue, useRecoilState } from "recoil";
import { cartDataState, userDataState } from "@/atoms";
import CartComponent from "@/components/CartComponent";
import { router } from "expo-router";
import { Button } from "react-native-paper";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ProductSchema {
  id: string,
  desc: string,
  name: string,
  img: string,
  price: string,
}

interface DataSchema {
  quantity: number,
  product: ProductSchema
}

const Cart = () => {
  const [cart, setCart] = useRecoilState(cartDataState);
  const userSession = useRecoilValue(userDataState);

  useEffect(() => {
    async function getFromDB() {
      try {
        const { data, error } = await supabase
          .from("cart")
          .select("id, quantity, product!product_id(name, price, img, desc, id)")
          .eq("user_id", userSession.id) as {
            data: DataSchema[] | null,
            error: any
          };
        if (error) {
          Alert.alert(error.message);
        }
        console.log(data);
        if (data) {
        setCart(
          data.map((el: DataSchema) => {
            return {
              id: el.product.id,
              name: el.product.name,
              price: el.product.price,
              desc: el.product.desc,
              img: el.product.img,
              quan: el.quantity,
            };
          })
        
        );
      } else {
        setCart([])
      }
      } catch (e) {
        console.log(e);
      }
    }

    getFromDB();
  }, []);

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
          <Button
            onPress={() => {
              if (cart.length != 0) {
                router.push("./order");
              } else {
                Alert.alert("Cart Empty!");
              }
            }}
          >
            Proceed to Checkout
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Cart;
