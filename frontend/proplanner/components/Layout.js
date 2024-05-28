import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";


export function GlobalLayout({ children, isScrollview = true }) {
  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior="padding">
        {isScrollview ? (
          <ScrollView style={StyleSheet.container} >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
  },
});