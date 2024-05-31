import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_TOKEN } from "@/constants/AsyncStorage"

export async function verifyToken(userToken) {
  const auth = `Bearer ${userToken}`
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/varifyToken`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: auth,
    },
  })
  return await response.json();
}

export async function registerUser(email, password) {
    const json = {
      email: email,
      password: password,
    };
    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json),
    })
    
    return await response.json();
  }

export async function loginUser(email, password) {
    const json = {
        email: email,
        password: password,
      };
      const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
      })
      
      return await response.json();
}


export async function deleteUser() {
    const userToken = await AsyncStorage.getItem(USER_TOKEN);
    const auth = `Bearer ${userToken}`

    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: auth,
      },
    })
      
    return null;
}