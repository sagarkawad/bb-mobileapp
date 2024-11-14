import { View, Text, Image, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartDataState, userDataState } from "@/atoms";
import { Button } from "react-native-paper";
import { supabase } from "@/lib/supabase";

const Product = () => {
  const { id, name, img, desc, price } = useLocalSearchParams();
  const [cart, setCart] = useRecoilState(cartDataState);
  const userDataSession = useRecoilValue(userDataState);

  const handlePress = async (
    passid: any,
    passname: any,
    passimg: any,
    passdesc: any,
    passprice: any
  ) => {
    let duplicate = false;

    const updateDataDB = async () => {
      try {
        const { data, error } = await supabase
          .from("cart")
          .insert([
            { quantity: 1, user_id: userDataSession.id, product_id: passid },
          ])
          .select();
        if (error) {
          Alert.alert(error.message);
        }
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };

    setCart((prevState) => {
      prevState.map((el) => {
        if (el.id === passid) {
          duplicate = true;
        }
      });
      if (duplicate) {
        Alert.alert("Item already in the cart!");
        return [...prevState];
      } else {
        Alert.alert("Item added successfully!");
        updateDataDB();
        return [
          ...prevState,
          {
            id: passid,
            name: passname,
            img: passimg,
            desc: passdesc,
            price: passprice,
            quan: 1,
          },
        ];
      }
    });
    console.log(`${passid} ${passname} ${passimg} ${passdesc} ${passprice}`);
  };

  return (
    <View className="flex p-4 flex-col  h-full justify-between">
      <View>
        <Image
          className="w-full h-60 object-cover rounded mb-2"
          source={{ uri: `${img}` }}
        />
        <Text className="text-2xl mb-4">{name}</Text>
        <Text className="mb-4">{desc}</Text>
      </View>

      <View className="flex flex-row justify-between items-center">
        <View className="flex bg-blue-500 h-10 w-40 justify-center items-center rounded">
          <Button
            onPress={() => {
              if (userDataSession.id != null) {
                router.push("./cart");
              } else {
                Alert.alert("Login to Continue!");
                router.push("./../(account)/signin");
              }
            }}
            className="text-white"
          >
            Go to Cart!
          </Button>
        </View>
        <View className="flex bg-blue-500 h-10 w-40 justify-center items-center rounded">
          <Button
            className="text-white"
            onPress={() => {
              if (userDataSession.id != null) {
                handlePress(id, name, img, desc, price);
              } else {
                Alert.alert("Login to Continue!");
                router.push("./../(account)/signin");
              }
            }}
          >
            Add to Cart!
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Product;
