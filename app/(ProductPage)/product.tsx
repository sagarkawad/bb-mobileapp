import { View, Text, Image, Button, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useRecoilState } from "recoil";
import { cartData } from "@/atoms";

const product = () => {
  const { id, name, img, desc, price } = useLocalSearchParams();
  const [cart, setCart] = useRecoilState(cartData);
  const handlePress = (
    passid: any,
    passname: any,
    passimg: any,
    passdesc: any,
    passprice: any
  ) => {
    let duplicate = false;
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
          <Link href="./cart">
            <Text className="text-white">Go to Cart!</Text>
          </Link>
        </View>
        <View className="flex bg-blue-500 h-10 w-40 justify-center items-center rounded">
          <Text
            className="text-white"
            onPress={() => handlePress(id, name, img, desc, price)}
          >
            Add to Cart!
          </Text>
        </View>
      </View>
    </View>
  );
};

export default product;
