import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";

export default function WelkomScreen() {
  return (
    <LinearGradient
      colors={["rgba(0, 183, 255, 1)", "rgba(55, 0, 117, 1)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <ThemedView
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          top: 40,
        }}
      >
        <Image
          source={require("@/assets/images/SHICON4.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <ThemedText
          type="title"
          style={{
            color: "white",
            fontSize: 38,
            textAlign: "center",
            marginTop: 30,
            lineHeight: 40,
          }}
        >
          Welkom!
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          padding: 20,
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          height: "35%",
          width: "90%",
          bottom: 15,
          position: "absolute",
          alignItems: "center",
        }}
      ></ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Let's get started!
        </ThemedText>

        <LinearGradient
          colors={["#00B7FF", "#370075"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Pressable
            style={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <Link
              href="/login"
              asChild
              style={{ width: "100%", textAlign: "center" }}
            >
              <ThemedText>Inloggen</ThemedText>
            </Link>
          </Pressable>
        </LinearGradient>

        <LinearGradient
          colors={["#00B7FF", "#370075"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Pressable
            style={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <Link
              href="/register"
              asChild
              style={{ width: "100%", textAlign: "center" }}
            >
              <ThemedText>Registreren</ThemedText>
            </Link>
          </Pressable>
        </LinearGradient>
      </ThemedView>
    </LinearGradient>
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
    width: 220,
    height: 220,
    backgroundColor: "transparent",
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
    height: "35%",
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
