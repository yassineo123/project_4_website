import { Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");  // jouw opgeslagen login info
    router.replace("/welkom");              // ga terug naar welkom.tsx
  };

  return (
    <Pressable
      onPress={handleLogout}
      style={{
        padding: 10,
        backgroundColor: "#e63946",
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>Uitloggen</Text>
    </Pressable>
  );
}
