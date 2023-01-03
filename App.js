import React from "react";
import Router from "./src/router";
import { NativeBaseProvider, extendTheme } from "native-base";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "./src/context/UserContext";
import { NavigationContainer } from '@react-navigation/native'



export default function App() {
  const client = new QueryClient()
  return (
    <NavigationContainer>
    <QueryClientProvider client={client}>
      <UserContextProvider>
        <NativeBaseProvider >
          <Router />
        </NativeBaseProvider>
      </UserContextProvider>
    </QueryClientProvider>
   </NavigationContainer>
    )}