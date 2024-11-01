import { View, Text, ScrollView, FlatList } from "react-native";
import { Link } from "expo-router";
import ProductCard from "@/components/ProductCard";
import useWallpaper from "@/hooks/usePhotos";
import usePhotos from "@/hooks/usePhotos";
import { ThemedView } from "@/components/ThemedView";

const Index = () => {
  const data = usePhotos();
  return (
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
  );
};

export default Index;
