import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return(
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{ 
            title: "meloAI", 
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 28,
              fontWeight: "bold",
            }, 
          }}
        />
      </Stack>
    </>
  );
}
