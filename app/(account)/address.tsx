import React, { useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { addressesState, selectedAddressState, userDataState } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import { supabase } from "@/lib/supabase";

const Address = () => {
  const [address, setAddress] = useRecoilState(addressesState);
  const [selectedAddress, setSelectedAddress] = useRecoilState(selectedAddressState);
  const userSession = useRecoilValue(userDataState);
  const [userInput, setUserInput] = useState("");

  const addAddresstoDB = async () => {
    if (userInput.trim() === "") {
      Alert.alert("Please enter an Address");
      return;
    }

    const isDuplicate = address.some((addr) => addr.ad === userInput.trim());
    if (isDuplicate) {
      Alert.alert("This address already exists.");
      return;
    }

    const { data, error } = await supabase
      .from("address")
      .insert([{ address: userInput, user_id: userSession.id }])
      .select();

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Address successfully added");
      setUserInput("");
      if (data && data.length > 0) {
        setAddress((prevAddresses) => [
          ...prevAddresses,
          ...data.map((el) => ({ id: el.id, ad: el.address })),
        ]);
      }
    }
  };

  const removeAddressFromDB = async (id) => {
    const { error } = await supabase.from("address").delete().eq("id", id);
    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Address successfully removed");
      setAddress((prevAddresses) => prevAddresses.filter((ad) => ad.id !== id));
    }
  };

  const editAddressFromDB = async (id) => {
    if (userInput.trim() === "") {
      Alert.alert("Please enter an Address");
      return;
    }

    const isDuplicate = address.some((addr) => addr.ad === userInput.trim());
    if (isDuplicate) {
      Alert.alert("This address already exists.");
      return;
    }

    const { data, error } = await supabase.from("address").update({ address: userInput }).eq("id", id) as {
      data: {id: string, address: string}[] | null,
      error: any
    };
    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Address successfully edited");
      setUserInput("");
      if (data && data.length > 0) {
        setAddress(prevAddresses => {
          const index = prevAddresses.findIndex(addr => addr.id === id);
          const updatedAddress = { id: data[0].id, ad: data[0].address };
          const newAddresses = [...prevAddresses];
          if (index !== -1) {
            newAddresses[index] = updatedAddress;
          }
          return newAddresses;
        });
      }
    }
  };

  useEffect(() => {
    async function getFromDB() {
      try {
        const { data, error } = await supabase
          .from("address")
          .select("id, address")
          .eq("user_id", userSession.id);

        if (error) {
          Alert.alert(error.message);
        } else if (data && data.length !== 0) {
          setAddress(data.map((el) => ({ id: el.id, ad: el.address })));
        }
      } catch (e) {
        console.log(e);
      }
    }

    getFromDB();
  }, [addAddresstoDB, removeAddressFromDB, editAddressFromDB]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type new address here..."
          value={userInput}
          onChangeText={(newText) => setUserInput(newText)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addAddresstoDB}>
          <Text style={styles.buttonText}>Add Address</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Saved Addresses</Text>

  
      {address.length > 0 ? (
        <RadioButton.Group onValueChange={(newValue) => setSelectedAddress(newValue)} value={selectedAddress}>
              <FlatList
        data={address}
        renderItem={({ item }) => (
          <View style={styles.addressItem}>
            <View style={styles.addressInfo}>
              <RadioButton value={item.ad} />
              <Text style={styles.addressText}>{item.ad}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => removeAddressFromDB(item.id)} style={styles.removeButton}>
                <Text style={styles.buttonText}>❌</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editAddressFromDB(item.id)} style={styles.editButton}>
                <Text style={styles.buttonText}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
        </RadioButton.Group>
      ) : (
        <Text style={styles.noAddressText}>No addresses found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  removeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 10,
  },
  noAddressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default Address;
