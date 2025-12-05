import { Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Link } from "expo-router";
import { ThemedView } from "./themed-view";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  const router = useRouter();


  return (
    <ThemedView style={{backgroundColor: "white", width: "100%", height: 50, bottom: 0, position: "relative", display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                    <Pressable
      onPress={() => router.replace("/")}
      style={{
      }}
    >
      <Text style={{ color: "#000000ff", fontWeight: "bold" }}>meldingen</Text>
    </Pressable>
            <Pressable
      onPress={() => router.replace("/klacht")}
      style={{
      }}
    >
      <Text style={{ color: "#000000ff", fontWeight: "bold" }}>klachten</Text>
    </Pressable>
    <LogoutButton/>
    </ThemedView>
  );
}
