import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as React from "react";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/nav-bar";
import { AuthContext } from "@/app/AuthProvider";
import { useEffect, useState, useContext } from "react";
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
  ActivityIndicator,
} from "react-native";

export default function MeldingPost() {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [titel, setTitel] = useState("");
  const [bericht, setBericht] = useState("");
  const [prioriteit, setPrioriteit] = useState<"laag" | "normaal" | "hoog">("laag");
  const [gebouw, setGebouw] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // wacht eerst tot AuthProvider klaar is met laden
    if (authLoading) return;

    // Als er geen ingelogde user is (extra check), stuur naar welkom
    if (!user) {
      router.replace("/welkom");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Niet ingelogd", "Je moet ingelogd zijn om een melding aan te maken.");
      return;
    }
    if (!titel.trim()) {
      Alert.alert("Validatie", "Voer een titel in.");
      return;
    }
    if (!bericht.trim()) {
      Alert.alert("Validatie", "Voer een bericht in.");
      return;
    }

    const payload = {
      titel: titel.trim(),
      bericht: bericht.trim(),
      prioriteit,
      gebouw: gebouw.trim(),
      gebruiker_id: user.gebruiker_id,
    };

    setLoading(true);
    try {
      const res = await fetch("https://immersible-letty-paranormal.ngrok-free.dev//create_announcement.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // probeer JSON te lezen, maar vang non-JSON af
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("Server returned non-JSON:", text);
        Alert.alert("Serverfout", "Ongeldige server response. Check server logs.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // server gaf error status
        Alert.alert("Fout", json.error || "Kon melding niet aanmaken");
        setLoading(false);
        return;
      }

      // success
      Alert.alert("Succes", "Melding succesvol aangemaakt.");
      // Redirect naar meldingen overzicht
      router.replace("/");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Netwerkfout", err.message || "Kon geen verbinding maken met server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["beheerder"]}>
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
              Melding aanmaken
            </ThemedText>

            <ThemedView style={{ paddingBottom: 20, width: "100%", alignItems: "center" }}>
              {/* Titel */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Titel</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Voer een korte titel in"
                  autoCapitalize="sentences"
                  value={titel}
                  onChangeText={setTitel}
                  placeholderTextColor="#c4c4c4ff"
                />
              </View>

              {/* Bericht - multiline */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Bericht</ThemedText>
                <TextInput
                  style={[styles.input, { height: 120, textAlignVertical: "top" }]}
                  placeholder="Beschrijf de melding"
                  multiline
                  numberOfLines={6}
                  value={bericht}
                  onChangeText={setBericht}
                  placeholderTextColor="#c4c4c4ff"
                />
              </View>

              {/* Prioriteit */}
              <View style={[styles.inputGroup, { paddingVertical: 12 }]}>
                <ThemedText style={styles.label}>Prioriteit</ThemedText>
                <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                  {(["laag", "normaal", "hoog"] as const).map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => setPrioriteit(p)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        borderWidth: prioriteit === p ? 2 : 1,
                        borderColor: prioriteit === p ? "#370075" : "#ddd",
                        backgroundColor: prioriteit === p ? "rgba(55,0,117,0.08)" : "transparent",
                        marginRight: 8,
                      }}
                    >
                      <ThemedText style={{ fontWeight: prioriteit === p ? "700" : "500" }}>{p}</ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Gebouw */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Gebouw</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Bijv. Gebouw A"
                  value={gebouw}
                  onChangeText={setGebouw}
                  placeholderTextColor="#c4c4c4ff"
                />
              </View>

              {/* Submit */}
              <View style={{ width: "90%", alignItems: "center", marginTop: 10 }}>
                <Pressable
                  onPress={handleSubmit}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                  disabled={loading}
                >
                  <LinearGradient colors={["#00B7FF", "#370075"]}             start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }} style={{ padding: 14, alignItems: "center" }}>
                    {loading ? (
                      <ActivityIndicator />
                    ) : (
                      <ThemedText style={{ color: "white" }}>Plaats melding</ThemedText>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </ThemedView>
          </ThemedView>
        </LinearGradient>
      </TouchableWithoutFeedback>
      <NavBar />
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    position: "absolute",
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
    marginBottom: 10,
    marginTop: 10,
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
    marginTop: 6,
  },
  input: {
    height: 36,
    paddingVertical: 6,
  },
});
