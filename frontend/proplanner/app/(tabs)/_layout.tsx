import { Tabs } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";

import {useLoggedInState} from "@/context/loggedInContext"
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {verifyToken} from '@/api/user'
import { LoginScreen } from "../login"


export default function TabLayout() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {isLoggedIn, setIsLoggedIn} = useLoggedInState();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    (async ()=> {
      // parse token from the async storage (for auto login) && check token's validality
      const token = await AsyncStorage.getItem('user-token');
      const result = await verifyToken(token)
      setIsLoggedIn(!result.error)
      // setIsLoggedIn(false)
      setReady(true);
    })()
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="darkorange" />
      </View>
    )
  }

  return (
    isLoggedIn && isReady ? (
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'golf' : 'golf-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
    ): (
      <LoginScreen onLogin={()=>{setIsLoggedIn(true)}} />
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
