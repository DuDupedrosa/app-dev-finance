import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { customTheme } from "@/theme/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: customTheme.colors["gray-900"],
          height: 70,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderColor: customTheme.colors["gray-900"],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Gastos",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"attach"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="addSpent"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"add-circle"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={"person"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
