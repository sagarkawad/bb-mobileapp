import { View, Text, ScrollView, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import ProductCard from "@/components/ProductCard";
import useWallpaper from "@/hooks/usePhotos";
import usePhotos from "@/hooks/usePhotos";
import { ThemedView } from "@/components/ThemedView";
import { useRecoilState, useRecoilValue } from "recoil";
import { userDataState, addressesState, cartDataState } from "@/atoms";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "react-native-paper";

interface ProductSchema {
  id: string, 
  desc: string,
  name: string,
  img: string,
  price: string,
}

interface DataSchema {
  quantity: number
  product: ProductSchema
}

const Index = () => {
  const [data, setData] = useState([]);
  const [userDataSession, setUserDataSession] = useRecoilState(userDataState);
  const [address, setAddress] = useRecoilState(addressesState);
  const [cart, setCart] = useRecoilState(cartDataState);
  const userSession = useRecoilValue(userDataState);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && session.user.email) {
        setUserDataSession({
          id: session?.user.id,
          email: session?.user.email,
        });

        try {
          const { data, error } = await supabase
            .from("address")
            .select("id, address")
            .eq("user_id", session?.user.id);
          if (error) {
            Alert.alert(error.message);
          } else if (data.length != 0) {
            setAddress(
              data.map((el) => {
                //@ts-ignore
                return { id: el.id, ad: el.address };
              })
            );
          }
          console.log(data);
        } catch (e) {
          console.log(e);
        }

        async function getFromDB() {
          try {
            const { data, error } = await supabase
              .from("cart")
              .select(
                "id, quantity, product!product_id (name, price, img, desc, id)"
              )
              .eq("user_id", session?.user.id);
            if (error) {
              Alert.alert(error.message);
            }
            console.log(data);
            if (data) {
            setCart(
              data.map((el: any) => {
                return {
                  id: el.product.id,
                  name: el.product.name,
                  price: el.product.price,
                  desc: el.product.desc,
                  img: el.product.img,
                  quan: el.quantity,
                };
              })
            )
          } else {
            setCart([])
          };
          } catch (e) {
            console.log(e);
          }
        }

        getFromDB();
      }
    });

    const getData = async () => {
      const data = await usePhotos();
      //@ts-ignore
      setData(data);
      console.log(data);
    };
    getData();

    console.log("cart", cart);
  }, []);

  function showCart() {
    console.log("cart from function = ", cart);
    router.push("./../(index)/cart");
  }

  return (
    <View className="h-full">
      <ScrollView className="p-4">
        {data.map((el: {name: string, img: string, id: string, desc: string, price: string}) => {
          return (
            <ProductCard
              name={el.name}
              img={el.img}
              id={el.id}
              desc={el.desc}
              price={el.price}
              key={el.id}
            />
          );
        })}
      </ScrollView>
      {userDataSession.id ? (
        <View className="absolute bottom-2 left-4 rounded-full  w-16 h-16 flex items-center justify-center bg-red-200 shadow-md">
          {/* <Link href="./../(index)/cart"> */}
          <Button onPress={showCart} className="text-3xl">
            🛒
          </Button>
          {/* </Link> */}
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

export default Index;
