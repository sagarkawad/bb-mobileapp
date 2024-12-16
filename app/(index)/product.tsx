import { View, Text, ScrollView, Alert, StyleSheet, Dimensions, Image, useWindowDimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartDataState, userDataState } from "@/atoms";
import { Button } from "react-native-paper";
import { useState } from 'react';
import { supabase } from "@/lib/supabase";
import Carousel from 'react-native-reanimated-carousel';
import RenderHtml from 'react-native-render-html';

const Product = () => {
  const { id, name, img, desc, price } = useLocalSearchParams();
  const [cart, setCart] = useRecoilState(cartDataState);
  const userDataSession = useRecoilValue(userDataState);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const pics = img.split(",");
  
  

  const handlePress = async (passid, passname, passimg, passdesc, passprice) => {
    let duplicate = false;

    const updateDataDB = async () => {
      try {
        const { data, error } = await supabase
          .from("cart")
          .insert([{ quantity: 1, user_id: userDataSession.id, product_id: passid }])
          .select();
        Alert.alert("Item added successfully!");
        if (error) {
          Alert.alert(error.message);
          console.log(error.message)
        }
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
  };


  //console.log(productimg)


  return (
    <ScrollView style={styles.container}>
      <Carousel
        width={Dimensions.get('window').width}
        height={300}
        data={pics}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image source={{ uri: item }} style={styles.productImage} />
          </View>
        )}
      />
      <ScrollView style={styles.productInfoContainer} nestedScrollEnabled={true}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>Rs.{price}</Text>
        <Text style={styles.productDescription}>{desc}</Text>   
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          style={styles.cartButton} 
          onPress={() => {
            if (userDataSession.id != null) {
              router.push("./cart");
            } else {
              Alert.alert("Login to Continue!");
              router.push("./../(account)/signin");
            }
          }}
        >
          Go to Cart
        </Button>
        <Button 
          mode="contained" 
          loading={isAddingToCart} 
          style={styles.addToCartButton} 
          onPress={() => {
            if (userDataSession.id != null) {
              setIsAddingToCart(true);
              handlePress(id, name, pics[0], desc, price);
              setIsAddingToCart(false);
            } else {
              Alert.alert("Login to Continue!");
              router.push("./../(account)/signin");
            }
          }}
        >
          Add to Cart
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  productInfoContainer: {
    maxHeight: 430,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6347',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 26,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  cartButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#1E90FF',
  },
  addToCartButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#FF6347',
  },
});

export default Product;
