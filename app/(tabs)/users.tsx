import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "./../../lib/supabase";

type User = {
  id: string;
  email: string;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      let { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        //@ts-ignore
        setUsers(data);
        console.log(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View>
      {users.map((user) => (
        <Text key={user.id}>{user.email}</Text>
      ))}
    </View>
  );
}
