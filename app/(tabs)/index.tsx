import { View, Text, ScrollView, FlatList, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
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
          } else if (data.length !== 0) {
            setAddress(
              data.map((el) => ({ id: el.id, ad: el.address }))
            );
          }
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
              .eq("user_id", session?.user.id) as {
                data: DataSchema[] | null,
                error: any,
              };
            if (error) {
              Alert.alert(error.message);
            }
            if (data) {
              setCart(
                data.map((el: DataSchema) => ({
                  id: el.product.id,
                  name: el.product.name,
                  price: el.product.price,
                  desc: el.product.desc,
                  img: el.product.img,
                  quan: el.quantity,
                }))
              );
            } else {
              setCart([]);
            }
          } catch (e) {
            console.log(e);
          }
        }

        getFromDB();
      }
    });

    const getData = async () => {
      const data = await usePhotos();
      setData(data);
    };
    getData();
  }, []);

  function navigateToProduct(product) {
    router.push({ pathname: "./../(index)/product", params: product });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Our Store</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.productGrid}>
          {data.map((el: ProductSchema) => (
            <TouchableOpacity 
              key={el.id} 
              style={styles.productCard} 
              onPress={() => navigateToProduct(el)}
            >
              <Image source={{ uri: el.img?.link1 }} style={styles.productImage} />
              <Text style={styles.productName}>{el.name}</Text>
              <Text style={styles.productPrice}>Rs.{el.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {userDataSession.id && (
        <View style={styles.cartButtonContainer}>
          <Button onPress={() => router.push("./../(index)/cart")} style={styles.cartButtonText}>
            🛒
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  cartButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    fontSize: 24,
  },
});

export default Index;
