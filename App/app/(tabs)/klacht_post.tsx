import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/nav-bar";
import { AuthContext } from "@/app/AuthProvider";
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";

export default function KlachtPost() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [klacht, setKlacht] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!klacht.trim()) return Alert.alert("Fout", "Vul een klacht in.");

    setLoading(true);

    const payload = {
      klacht: klacht.trim(),
      gebruiker_id: user?.gebruiker_id,
    };

    try {
      const res = await fetch("https://immersible-letty-paranormal.ngrok-free.dev//create_klacht.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const json = JSON.parse(text);

      if (!res.ok) {
        Alert.alert("Fout", json.error || "Kon klacht niet indienen.");
        return;
      }

      Alert.alert("Succes", "Klacht ingediend.");
      router.replace("/klacht");

    } catch (err: any) {
      Alert.alert("Netwerkfout", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["student", "beheerder"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={["rgba(0, 183, 255, 1)", "rgba(55, 0, 117, 1)"]}
          style={styles.background}
        >
          <ThemedView
            style={{ position: "absolute", top: 20, width: "100%", alignItems: "center" }}
          >
            <Image
              source={require("@/assets/images/SHICON4.png")}
              style={styles.image}
            />
          </ThemedView>

          <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Klacht indienen
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Klacht</ThemedText>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                multiline
                placeholder="Beschrijf je probleem"
                value={klacht}
                onChangeText={setKlacht}
                placeholderTextColor="#b5b5b5"
              />
            </View>

            <Pressable onPress={handleSubmit} style={styles.button} disabled={loading}>
              <LinearGradient colors={["#00B7FF", "#370075"]} style={styles.buttonInner}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ThemedText style={{ color: "white" }}>Indienen</ThemedText>
                )}
              </LinearGradient>
            </Pressable>
          </ThemedView>
        </LinearGradient>
      </TouchableWithoutFeedback>

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

  title: { fontSize: 24, marginBottom: 15, marginTop: 10, color: "black" },

  inputGroup: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 10,
  },

  label: { color: "#777" },

  input: { marginTop: 5 },

  button: { width: "90%", marginTop: 20, borderRadius: 12, overflow: "hidden" },

  buttonInner: { padding: 14, alignItems: "center" },
});
