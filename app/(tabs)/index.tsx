import { View, Text, ScrollView, FlatList } from "react-native";
import { Link } from "expo-router";
import ProductCard from "@/components/ProductCard";
import useWallpaper from "@/hooks/usePhotos";
import usePhotos from "@/hooks/usePhotos";
import { ThemedView } from "@/components/ThemedView";
import { useRecoilState, useRecoilValue } from "recoil";
import { userDataState } from "@/atoms";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const data = usePhotos();
  const [userDataSession, setUserDataSession] = useRecoilState(userDataState);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email) {
        setUserDataSession({
          id: session?.user.id,
          email: session?.user.email,
        });
      }
    });
  }, []);

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
      {userDataSession.id ? (
        <View className="absolute bottom-2 left-4 rounded-full  w-16 h-16 flex items-center justify-center bg-red-200 shadow-md">
          <Link href="./../(index)/cart">
            <Text className="text-3xl">🛒</Text>
          </Link>
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

export default Index;
