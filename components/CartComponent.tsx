import React, { useState } from "react";
import { View, Image, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { cartDataState, userDataState } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { supabase } from "@/lib/supabase";

interface CartItem {
  id: string;
  quan: number;
  user_id: string;
  name: string;
  price: string;
  desc: string;
  img: string;
  quantity?: number;
}

const CartComponent = ({
  img,
  price,
  name,
  id,
  quan,
}: {
  img: string;
  price: string;
  name: string;
  id: string;
  quan: string;
}) => {
  return (
    <View style={styles.cartItemContainer}>
      <Image source={{ uri: img }} style={styles.productImage} />
      <View style={styles.productDetailsContainer}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>{`Rs. ${Number(price) * Number(quan)}`}</Text>
        <QuantityComponent quan={quan} id={id} />
      </View>
    </View>
  );
};

const QuantityComponent = ({ quan, id }: { quan: string; id: string }) => {
  const [cart, setCart] = useRecoilState(cartDataState);
  const [quantity, setQuantity] = useState(Number(quan));
  const userSession = useRecoilValue(userDataState);

  const plus = (id: string) => {
    setCart((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          setQuantity((prevQuantity) => prevQuantity + 1);
          const updateDbPlus = async () => {
            const { error } = await supabase
              .from("cart")
              .update({ quantity: item.quan + 1 })
              .eq("user_id", userSession.id);
            if (error) Alert.alert(error.message);
          };
          updateDbPlus();
          return { ...item, quan: item.quan + 1 };
        }
        return item;
      });
    });
  };

  const minus = (id: string) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && item.quan > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
            const updateDbMinus = async () => {
              const { error } = await supabase
                .from("cart")
                .update({ quantity: item.quan - 1 })
                .eq("user_id", userSession.id);
              if (error) Alert.alert(error.message);
            };
            updateDbMinus();
            return { ...item, quan: item.quan - 1 };
          } else if (item.id === id && item.quan === 1) {
            const removeFromDb = async () => {
              const { error } = await supabase
                .from("cart")
                .delete()
                .eq("user_id", userSession.id)
                .eq("product_id", item.id);
                console.log("inside the removefromdb")
              if (error) Alert.alert(error.message);
            };
            removeFromDb();
            return null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity onPress={() => minus(id)} style={styles.quantityButtonMinus}>
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity onPress={() => plus(id)} style={styles.quantityButtonPlus}>
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productDetailsContainer: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
    marginVertical: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 130,
  },
  quantityButtonPlus: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonMinus: {
    backgroundColor: '#FF6347',
    borderRadius: 4,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default CartComponent;
