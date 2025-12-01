// app/components/AuthGuard.tsx
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/app/AuthProvider";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g. ["student"] or ["beheerder"]
};

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wacht tot we weten of er een user is

    // Niet ingelogd -> welkom
    if (!user) {
      router.replace("/welkom");
      return;
    }

    // Ingelogd maar rol niet toegestaan
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      // stuur naar index of toon een no-access pagina
      router.replace("/");
      return;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // user aanwezig en / of role OK -> render children
  return <>{children}</>;
}
