import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as AppleAuthentication from "expo-apple-authentication";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";

interface Announcement {
  announcement_id: number;
  titel: string;
  bericht: string;
  prioriteit: string;
  gebouw?: string;
  gebruiker_id: number;
}

export default function MeldingScreen() {
const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetch("http://localhost:8000/enquiry.php") // IP van je PC/Server
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Fout bij ophalen meldingen", error.message);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={["rgba(0, 183, 255, 1)", "rgba(55, 0, 117, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
            Meldingen
          </ThemedText>
          <View style={{ width: "100%", marginTop: 10, flex: 1 }}>
      {loading ? (
        <ThemedText>Laden...</ThemedText>
      ) : (
        <ScrollView>
          {announcements.map((item) => (
            <View key={item.announcement_id} style={styles.card}>
              <ThemedText type="subtitle" style={{ fontSize: 18 }}>
                {item.titel}
              </ThemedText>
              <ThemedText>{item.bericht}</ThemedText>
              <ThemedText
                style={{
                  color: item.prioriteit === "hoog" ? "red" : "#777",
                  fontWeight: "bold",
                }}
              >
                Prioriteit: {item.prioriteit}
              </ThemedText>
              {item.gebouw && <ThemedText>Gebouw: {item.gebouw}</ThemedText>}
            </View>
          ))}
        </ScrollView>
      )}
          </View>
        </ThemedView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  image: {
    width: 120,
    height: 120,
    position: "absolute",
  },
  register: {
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    paddingEnd: 10,
    paddingStart: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    fontSize: 12,
    color: "#494949ff",
  },
    card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
    borderRadius: 30,
    height: "80%",
    width: "90%",
    bottom: 30,
    position: "absolute",
    alignItems: "center",
  },
  title: {
    color: "black",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  label: {
    color: "#777",
    fontSize: 14,
  },
  input: {
    height: 30,
  },
  button: {
    color: "white",
    textAlign: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logins: {
    marginTop: 50,
    backgroundColor: "transparent",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#dfdfdfff",
    borderWidth: 1,
    paddingEnd: 25,
    paddingStart: 25,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 8,
  },
});
