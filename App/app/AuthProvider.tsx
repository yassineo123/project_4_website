// app/AuthProvider.tsx
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  gebruiker_id: number;
  gebruikersnaam: string;
  rol: "student" | "beheerder" | string;
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("user");
        if (raw) setUserState(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setUser = async (u: User | null) => {
    setUserState(u);
    if (u) {
      await AsyncStorage.setItem("user", JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
