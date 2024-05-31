import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Switch, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";

import { ThemedText } from "@/components/ThemedText"
import { GlobalLayout } from "../../components/Layout"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser } from "@/api/user"
import {useLoggedInState} from "@/context/loggedInContext"
import { USER_TOKEN, MATRIX_SETTINGS } from "@/constants/AsyncStorage"

export default function TabSettingScreen() {
  const {isLoggedIn, setIsLoggedIn} = useLoggedInState();
  const [isMatrixArchived, setMatrixArchived] = useState(false);
  const [selectedMatrisLimit, setSelectedMatrisLimit] = useState(5); 

  useEffect(()=> {
    (async ()=> {
      const json = await AsyncStorage.getItem(MATRIX_SETTINGS);
      const settings = json != null ? JSON.parse(json) : null;  
      if (settings) {   
        setMatrixArchived(settings.archived ? true:false);
        setSelectedMatrisLimit(settings.limit);
      }
    })()
  }, [])

  useEffect(()=> {
    (async ()=> {
      const settings = {
        changed: 1,
        archived: isMatrixArchived ? 1: 0,
        limit: selectedMatrisLimit
      }
  
      let json = JSON.stringify(settings);
      await AsyncStorage.setItem(MATRIX_SETTINGS, json);      
    })()
  }, [isMatrixArchived, selectedMatrisLimit])

  const toggleSwitch = () => setMatrixArchived(previousState => !previousState);

  const settingsData = [
    {
      id: '1',
      type: 'toggle',
      title: 'Show Archeved Matrixes',
      value: isMatrixArchived,
      onValueChange: toggleSwitch,
    },
    {
      id: '2',
      type: 'dropdown',
      title: 'Number of Showing Matrixes',
      value: selectedMatrisLimit,
      onValueChange: (item) => {
        setSelectedMatrisLimit(item.value)
      },
      options: [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '15', value: 15 },
        { label: '20', value: 20 },
        { label: '30', value: 30 },
        { label: '50', value: 50 },
        { label: '75', value: 75 },
        { label: '100', value: 100 }
      ],
    },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'toggle':
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
            />
          </View>
        );
      case 'dropdown':
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Dropdown
              style={styles.dropdown}
              data={item.options}
              labelField="label"
              valueField="value"
              placeholder="Select number"
              value={item.value}
              onChange={item.onValueChange}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        setIsLoggedIn(false) // logout
        AsyncStorage.removeItem(MATRIX_SETTINGS);      
        AsyncStorage.removeItem(USER_TOKEN);
      }},
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Confirm Deletion', 'This action will result in losing all data.', [
      {
        text: 'Cancel',
        onPress: () => Toast.show({
            type: "info",
            text1: "Scare me there 😮‍💨",
            autoHide: true,
            visibilityTime: 1500,
            position: "bottom",
        }),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        setIsLoggedIn(false) // logout
        deleteUser()

        AsyncStorage.removeItem(MATRIX_SETTINGS);      
        AsyncStorage.removeItem(USER_TOKEN);
      }},
    
    ]);
  };

  return (
    <GlobalLayout isScrollview={false} >
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <ThemedText type='title' >Settings ⚙️</ThemedText>
          <FlatList
            data={settingsData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonLogout]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonDeleteAccount]} onPress={handleDeleteAccount}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GlobalLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  topContainer: {
  },
  bottomContainer: {
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: 18,
  },
  dropdown: {
    width: 80,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonLogout: {
    backgroundColor: 'grey',
  },
  buttonDeleteAccount: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});