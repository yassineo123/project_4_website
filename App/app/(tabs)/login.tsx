import React, { useState, useContext, useEffect } from "react";
import { Alert, Image, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/app/AuthProvider";


export default function LoginScreen() {
  const [gebruikersnaam, setGebruikersnaam] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [loadings, setLoadings] = useState(false);
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);

    useEffect(() => {
    if (!loading && user) {
      router.replace("/"); // al ingelogd -> naar index
    }
  }, [user, loading]);

  async function handleLogin() {
    if (!gebruikersnaam || !wachtwoord) return Alert.alert("Vul gebruikersnaam en wachtwoord in");

    setLoadings(true);
    try {
      const res = await fetch("https://immersible-letty-paranormal.ngrok-free.dev//login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gebruikersnaam, wachtwoord }),
      });
      const json = await res.json();

      if (!res.ok) {
        Alert.alert("Login mislukt", json.error || "Onbekende fout");
        setLoadings(false);
        return;
      }

      if (json.success && json.user) {
        // Sla user op in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(json.user));
        // Zet in context
        setUser(json.user);
        // Navigeer naar meldingen
        router.replace("/");
      } else {
        Alert.alert("Login mislukt", json.error || "Onbekende fout");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Fout", err.message || "Netwerkfout");
    } finally {
      setLoadings(false);
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={["rgba(0, 183, 255, 1)", "rgba(55, 0, 117, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <ThemedView style={{ position: "absolute", top: 20, left: 10 }}>
          <Image
            source={require("@/assets/images/SHICON4.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </ThemedView>
        <ThemedView
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            padding: 20,
            borderTopEndRadius: 30,
            borderTopStartRadius: 30,
            height: "75%",
            width: "90%",
            bottom: 15,
            position: "absolute",
            alignItems: "center",
          }}
        ></ThemedView>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Inloggen
          </ThemedText>

          {/* Email veld */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Gebruikersnaam</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Voer je gebruikersnaam in"
              keyboardType="default"
              autoCapitalize="none"
              placeholderTextColor="#c4c4c4ff"
              value={gebruikersnaam} onChangeText={setGebruikersnaam}
            />
          </View>

          {/* Password veld */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Wachtwoord</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Voer je wachtwoord in"
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#c4c4c4ff"
              value={wachtwoord} onChangeText={setWachtwoord}
            />
          </View>

          <LinearGradient
            colors={["#00B7FF", "#370075"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Pressable
              style={{ width: "100%", display: "flex", alignItems: "center" }}
              onPress={handleLogin}
            >
                <ThemedText>Inloggen</ThemedText>
            </Pressable>
          </LinearGradient>
          <ThemedText style={{ color: "black", marginTop: 15 }}>
            Wachtwoord vergeten?
          </ThemedText>
          <ThemedView style={styles.header}>
            <ThemedText style={{ fontSize: 12, color: "#6e6e6eff" }}>
              Nog geen account?{" "}
            </ThemedText>
            <Pressable>
              <Link href="/register" asChild>
                <ThemedText style={styles.register}>Registreren</ThemedText>
              </Link>
            </Pressable>
          </ThemedView>
          <ThemedView style={styles.footer}>
            <ThemedText
              style={{
                position: "absolute",
                color: "#a8a8a8ff",
                backgroundColor: "white",
                paddingLeft: 30,
                paddingRight: 30,
              }}
            >
              Of inloggen met
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.logins}>
            <ThemedView style={styles.option}>
              <Image
                source={require("@/assets/images/Google_icon.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
                resizeMode="contain"
              />
              <ThemedText style={{ color: "black" }}>Google</ThemedText>
            </ThemedView>
            <Pressable style={styles.option}>
              <Image
                source={require("@/assets/images/Apple_logo.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
                resizeMode="contain"
              />
              <ThemedText style={{ color: "black" }}>Apple</ThemedText>
            </Pressable>
          </ThemedView>
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
    marginBottom: 20,
    position: "absolute",
    left: 0,
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
  content: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    height: "75%",
    width: "100%",
    bottom: 0,
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
  footer: {
    width: "90%",
    height: 1,
    backgroundColor: "#c7c7c7ff",
    marginTop: 30,
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
