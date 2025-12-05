import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/nav-bar";
import { AuthContext } from "@/app/AuthProvider";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from "react-native";

interface Klacht {
  klacht_id: number;
  klacht: string;
  datum: string;
  gebruiker_id: number;
}

export default function KlachtScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [klachten, setKlachten] = useState<Klacht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://immersible-letty-paranormal.ngrok-free.dev//fetch_klachten.php")
      .then((res) => res.json())
      .then((data) => setKlachten(data))
      .catch((err) => {
        console.error(err);
        Alert.alert("Fout", "Kon klachten niet ophalen");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <LinearGradient
        colors={["rgba(0, 183, 255, 1)", "rgba(55, 0, 117, 1)"]}
        style={styles.background}
      >
        <ThemedView
          style={{
            position: "absolute",
            top: 20,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/SHICON4.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Klachten
          </ThemedText>

          {/* Studenten mogen klacht plaatsen */}
          {user?.rol === "student" && (
            <Pressable
              onPress={() => router.push("/klacht_post")}
              style={styles.createButton}
            >
              <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                Klacht indienen
              </ThemedText>
            </Pressable>
          )}

          <View style={{ width: "100%", marginTop: 10, flex: 1 }}>
            {loading ? (
              <ThemedText>Laden...</ThemedText>
            ) : (
              <ScrollView>
                {klachten.map((item) => (
                  <View key={item.klacht_id} style={styles.card}>
                    <ThemedText style={styles.cardTitle}>
                      Klacht #{item.klacht_id}
                    </ThemedText>

                    <ThemedText style={styles.cardText}>{item.klacht}</ThemedText>

                    <ThemedText style={styles.date}>
                      Datum: {item.datum}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </ThemedView>
      </LinearGradient>
      <NavBar />
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: 120, height: 120, position: "absolute" },

  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 30,
    height: "80%",
    width: "90%",
    bottom: 30,
    position: "absolute",
    alignItems: "center",
  },

  title: { fontSize: 24, marginTop: 20, marginBottom: 10, color: "black" },

  createButton: {
    backgroundColor: "#1d3557",
    padding: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  cardTitle: { fontSize: 18, fontWeight: "bold", color: "black" },

  cardText: { marginTop: 5, color: "#676767ff" },

  date: {
    marginTop: 10,
    padding: 5,
    alignSelf: "flex-start",
    backgroundColor: "#cfcfcf",
    borderRadius: 8,
  },
});
