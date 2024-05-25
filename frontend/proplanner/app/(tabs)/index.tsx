import { StyleSheet,View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { GlobalLayout } from "../../components/Layout";
import React, { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const [squareDoNow, setSquareDoNow] = useState('Do');
  const [squarePlan, setSquarePlan] = useState('Schedule');
  const [squareDelegate, setSquareDelegate] = useState('Delegate');
  const [squareDelete, setSquareDelete] = useState('Delete');
  const [editing, setEditing] = useState(false);

  
  const handleToggleEdit = () => {
    setEditing(prevEditing => !prevEditing);
  };

  const handleSave = () => {
    // Perform any saving logic here
    setEditing(false);
  };

  return (
    <GlobalLayout >

      <ThemedText type="title" style={styles.pageTitle}>Plan your life!</ThemedText>

      <View style={styles.container}>
      {/* Title row */}
      <View style={[styles.row, styles.titleRow]}>
        <View style={[styles.cell, styles.horizontalTitleCell]}>
          <Text style={[styles.title, styles.horizontalTitle]}>Urgent</Text>
        </View>
        <View style={[styles.cell, styles.horizontalTitleCell]}>
          <Text style={[styles.title, styles.horizontalTitle]}>Not Urgent</Text>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.row}>
        {/* Leftmost cell with row title */}
        <View style={[styles.cell, styles.verticalTitleCell]}>
          <Text style={[styles.title, styles.verticalTitle]}>Important</Text>
        </View>
        
        {/* Square cells */}
        <View style={[styles.cell, styles.doCell]}>
          <TextInput
            style={styles.input}
            placeholder={squareDoNow}
            multiline
            autoFocus
            onChangeText={setSquareDoNow}
            editable={editing ? true : false}
          />
        </View>
        <View style={[styles.cell, styles.scheduleCell]}>
          <TextInput
            style={styles.input}
            placeholder={squarePlan}
            multiline
            autoFocus
            onChangeText={setSquarePlan}
            editable={editing ? true : false}
          />
        </View>
      </View>

      {/* Second row */}
      <View style={styles.row}>
        <View style={[styles.cell, styles.verticalTitleCell]}>
          <Text style={[styles.title, styles.verticalTitle]}>Not important</Text>
        </View>
        <View style={[styles.cell, styles.delegateCell]}>
          <TextInput
            style={styles.input}
            placeholder={squareDelegate}
            multiline
            autoFocus
            onChangeText={setSquareDelegate}
            editable={editing ? true : false}
          />
        </View>
        <View style={[styles.cell, styles.deleteCell]}>
          <TextInput
            style={styles.input}
            placeholder={squareDelete}
            multiline
            autoFocus
            onChangeText={setSquareDelete}
            editable={editing ? true : false}
          />
        </View>
      </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={editing ? handleSave: handleToggleEdit}><Text>{editing ? "Save" : "Edit"}</Text></TouchableOpacity>


    </GlobalLayout>
    
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    marginLeft: 20
  },
  container: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    width: 160,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  input: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleRow: {
    marginBottom: 3,
    marginLeft: 20
  },
  verticalTitleCell: {
    width: '1%', 
    // textAlign: 'center',
    // justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  horizontalTitleCell: {
    height: 20,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'peru'
  },
  verticalTitle: {
    transform: [{ rotate: '-90deg' }],
    width: 130,
    textAlign: 'center',
  },
  horizontalTitle: {
  },
  
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginLeft: 35
  },

  doCell: {
    backgroundColor: 'mediumseagreen'
  },
  scheduleCell: {
    backgroundColor: 'sandybrown'
  },
  delegateCell: {
    backgroundColor: 'skyblue'
  },
  deleteCell: {
    backgroundColor: 'lightcoral'
  }
});
