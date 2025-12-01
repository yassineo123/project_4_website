// app/_layout.tsx (of App.tsx)
import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "./AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
