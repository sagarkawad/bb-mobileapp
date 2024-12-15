import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
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
          setCart([]);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getFromDB();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {cart && cart.map((el) => (
          <CartComponent
            key={el.id}
            img={el.img}
            price={el.price}
            name={el.name}
            quan={`${el.quan}`}
            id={el.id}
          />
        ))}
      </ScrollView>
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>
          Total: Rs. {cart.reduce((sum, el) => sum + Number(el.price) * el.quan, 0)}
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            if (cart.length !== 0) {
              router.push("./order");
            } else {
              Alert.alert("Cart is Empty!");
            }
          }}
          style={styles.checkoutButton}
          labelStyle={styles.buttonText}
        >
          Proceed to Checkout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Cart;
