import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import { LoginScreen } from "./login"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from 'react-native-toast-message';
import {verifyToken} from '../api/user'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);


        // parse token from the async storage (for auto login) && check token's validality
        const token = await AsyncStorage.getItem('user-token');
        const result = await verifyToken(token)
        setIsLoggedIn(!result.error)
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady])


  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLoggedIn ? (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      ): (
      <LoginScreen onLogin={()=>{
        setIsLoggedIn(true)
      }}></LoginScreen>
      )}
      <Toast />
    </ThemeProvider>
  );
}
