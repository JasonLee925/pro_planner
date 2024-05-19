import { StyleSheet,View, Text, TextInput, Button } from 'react-native';
import { GlobalLayout } from "../../components/Layout";
import React, { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [squareDoNow, setSquareDoNow] = useState('Do this now');
  const [squarePlan, setSquarePlan] = useState('Do this later');
  const [squareDelegate, setSquareDelegate] = useState('Delegate this');
  const [squareDelete, setSquareDelete] = useState('Thankless tasks');
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

      <ThemedText type="title" style={styles.intro}>Plan your life!</ThemedText>
      <ThemedText type="subtitle" style={styles.intro}>Urgent and Important:</ThemedText>
      <ThemedText type="default" style={styles.intro}>Tasks that you should do it NOW!!</ThemedText>
      <ThemedText type="subtitle" style={styles.intro}>Not Urgent but Important:</ThemedText>
      <ThemedText type="default" style={styles.intro}>Tasks that can wait, but please keep them in mind!</ThemedText>
      <ThemedText type="subtitle" style={styles.intro}>Urgent, but not Important:</ThemedText>
      <ThemedText type="default" style={styles.intro}>Tasks that must be done but won't take much effort.</ThemedText>
      <ThemedText type="subtitle" style={styles.intro}>Not Urgent and not Important:</ThemedText>
      <ThemedText type="default" style={styles.intro}>Distraction and unnecessary tasks.</ThemedText>

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
        <View style={styles.cell}>
          <TextInput
            style={styles.input}
            placeholder={squareDoNow}
            multiline
            autoFocus
            onChangeText={setSquareDoNow}
            editable={editing ? true : false}
          />
        </View>
        <View style={styles.cell}>
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
        <View style={styles.cell}>
          <TextInput
            style={styles.input}
            placeholder={squareDelegate}
            multiline
            autoFocus
            onChangeText={setSquareDelegate}
            editable={editing ? true : false}
          />
        </View>
        <View style={styles.cell}>
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

      <Button title={editing ? "Save" : "Edit"} onPress={editing ? handleSave: handleToggleEdit} />
    </GlobalLayout>
    
  );
}

const styles = StyleSheet.create({
  intro: {
    marginLeft: 10
  },
  container: {
    // flex: 1,
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
    height: 160,
    backgroundColor: 'peachpuff',
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
    width: 10, 
    height: 160,
    backgroundColor: 'transparent',
  },
  horizontalTitleCell: {
    width: 160, 
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
    width: 150,
    textAlign: 'center'
  },
  horizontalTitle: {
  },

});
