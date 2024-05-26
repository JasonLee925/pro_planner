import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {registerUser, loginUser} from "../api/user"
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResgister, setIsRegister] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [isResgister]);

  const handleLogin = async () => {
    data = await loginUser(email, password);
    if (data.error === true) {
        Alert.alert("Fail at login🤔", data.message);
        return;
    }
    await AsyncStorage.setItem('user-token', data.token);
    onLogin();
  };

  const handleRegister = async () => {
    if (email == "" || password == "" || confirmPassword == "") {
      Alert.alert("Email or passwords cannot be empty.");
      return;
    }
    if (password != confirmPassword) {
      Alert.alert("The entered passwords don't match.");
      return;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      Alert.alert("The entered email is invalid.");
      return;
    }

    data = await registerUser(email, password)
    if (data.error === true) {
            Alert.alert("Something went wrong 😣", data.message);
            return;
    }

    Alert.alert("Welcome! 🥳", "You have successfully signed up.", [
      {
        text: "OK",
        onPress: () => handleLogin(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={[styles.title, styles.text]}>
      Hello👋  
      </ThemedText>
      <ThemedText type="title" style={[styles.subtitle, styles.text]}>
      Ready to plan?
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isResgister ? (
        <View style={styles.innerView}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text>Register</Text>
          </TouchableOpacity>
          <ThemedText style={styles.signUpText}>
            Already have an account?{"  "}
            <TouchableOpacity onPress={() => setIsRegister(false)}>
              <ThemedText type="link">Sign in</ThemedText>
            </TouchableOpacity>
          </ThemedText>
        </View>
      ) : (
        <View style={styles.innerView}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text>Login</Text>
          </TouchableOpacity>
          <ThemedText style={styles.signUpText}>
            Don't have an account?{"  "}
            <TouchableOpacity onPress={() => setIsRegister(true)}>
              <ThemedText type="link">Sign up</ThemedText>
            </TouchableOpacity>
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerView: {
    width: "100%",
  },
  title: {
    marginTop: 0,
    marginBottom: 0,
  },
  subtitle: {
    marginBottom: 20
  },
  text: {
    color: "gold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 20,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "gold",
    borderRadius: 10,
  },
  button: {
    width: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gold",
    borderRadius: 10,
    marginVertical: 10,
  },
  signUpText: {
    marginTop: 10,
    alignSelf: "center",
  },
});
