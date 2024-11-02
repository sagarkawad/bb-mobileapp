import { View, Text, ScrollView, FlatList } from "react-native";
import { Link } from "expo-router";
import ProductCard from "@/components/ProductCard";
import useWallpaper from "@/hooks/usePhotos";
import usePhotos from "@/hooks/usePhotos";
import { ThemedView } from "@/components/ThemedView";

const Index = () => {
  const data = usePhotos();
  return (
    <View>
      <ScrollView className="p-4">
        {data.map((el) => {
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
      <View className="absolute bottom-2 rounded-full w-14 h-14 flex items-center justify-center border left-2">
        <Link href="./(index)/cart">
          <Text className="text-3xl">🛒</Text>
        </Link>
      </View>
    </View>
  );
};

export default Index;
