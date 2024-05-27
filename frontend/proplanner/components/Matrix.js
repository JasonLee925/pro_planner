import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";

export function EisenhowerMatrix({ matrixDetails, isSave, onSave }) {
  const [squareDoNow, setSquareDoNow] = useState("Do");
  const [squarePlan, setSquarePlan] = useState("Schedule");
  const [squareDelegate, setSquareDelegate] = useState("Delegate");
  const [squareDelete, setSquareDelete] = useState("Delete");

  useEffect(() => {
    if (matrixDetails === null) return;
    setSquareDoNow(matrixDetails.do);
    setSquarePlan(matrixDetails.schedule);
    setSquareDelete(matrixDetails.delete);
    setSquareDelegate(matrixDetails.delegate);
  }, [matrixDetails]);

  useEffect(() => {
    (async() => {
        if (isSave === true) {
            await onSave({
              do: squareDoNow,
              schedule: squarePlan,
              delegate: squareDelegate,
              delete: squareDelete,
            });
        }   
    })()
    
  }, [isSave]);

  return (
    <View>
      <View style={styles.container}>
        {/* Title row */}
        <View style={[styles.row, styles.titleRow]}>
          <View style={[styles.cell, styles.horizontalTitleCell]}>
            <Text style={[styles.title, styles.horizontalTitle]}>Urgent</Text>
          </View>
          <View style={[styles.cell, styles.horizontalTitleCell]}>
            <Text style={[styles.title, styles.horizontalTitle]}>
              Not Urgent
            </Text>
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
              placeholder="Do"
              value={squareDoNow}
              multiline
              onChangeText={setSquareDoNow}
            />
          </View>
          <View style={[styles.cell, styles.scheduleCell]}>
            <TextInput
              style={styles.input}
              placeholder="Schedule"
              value={squarePlan}
              multiline
              onChangeText={setSquarePlan}
            />
          </View>
        </View>

        {/* Second row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.verticalTitleCell]}>
            <Text style={[styles.title, styles.verticalTitle]}>
              Not important
            </Text>
          </View>
          <View style={[styles.cell, styles.delegateCell]}>
            <TextInput
              style={styles.input}
              placeholder="Delegate"
              value={squareDelegate}
              multiline
              onChangeText={setSquareDelegate}
            />
          </View>
          <View style={[styles.cell, styles.deleteCell]}>
            <TextInput
              style={styles.input}
              placeholder="Delete"
              value={squareDelete}
              multiline
              onChangeText={setSquareDelete}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cell: {
    width: 160,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleRow: {
    marginBottom: 3,
    marginLeft: 20,
  },
  verticalTitleCell: {
    width: "1%",
    // textAlign: 'center',
    // justifyContent: 'center',
    backgroundColor: "transparent",
  },
  horizontalTitleCell: {
    height: 20,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "peru",
  },
  verticalTitle: {
    transform: [{ rotate: "-90deg" }],
    width: 130,
    textAlign: "center",
  },
  horizontalTitle: {},
  doCell: {
    backgroundColor: "mediumseagreen",
  },
  scheduleCell: {
    backgroundColor: "sandybrown",
  },
  delegateCell: {
    backgroundColor: "skyblue",
  },
  deleteCell: {
    backgroundColor: "lightcoral",
  },
});
