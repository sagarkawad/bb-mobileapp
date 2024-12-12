import { useRouter, Link } from "expo-router";
import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";

const ProductCard = ({
  name,
  img,
  id,
  desc,
  price,
}: {
  name: string;
  img: string;
  id: string;
  desc: string;
  price: string;
}) => {

  const router = useRouter();

  function jumpToProduct () {
    router.push({
      pathname: "./../(index)/product",
      params: { id, name, img, desc, price }
    });
  }

  return (
    <View className=" p-4 mb-4 w-full rounded border-b border-blue-500">
      <Text className=" mb-2 text-bold text-2xl">{name}</Text>
      <Image
        className="w-full h-60 object-cover rounded mb-2"
        source={{
          uri: img,
        }}
      />
      <View className="flex items-end justify-center">
        <View className="bg-blue-300 h-10 w-36 rounded flex items-center justify-center">
          <Link
            href={{
              pathname: "./../(index)/product",
              params: { id, name, img, desc, price },
            }}
          >
            <Button className="text-white">Check Out ▶️</Button>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
