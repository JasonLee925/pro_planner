import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GlobalLayout } from "../../components/Layout";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { EisenhowerMatrix } from "../../components/Matrix";
import Toast from "react-native-toast-message";
import { searchMatrixes, getlatestMatrix, getMatrixById, createMatrix, updateMatrix, updateMatrixDetails } from "../../api/matrix";

export default function HomeScreen() {
  // const data = [
  //   { label: "Current", value: 10 },
  //   { label: "Item 2", value: 1 },
  //   { label: "Item 3", value: 2 },
  //   { label: "Item 4", value: 3 },
  //   { label: "Item 5", value: 4 },
  //   { label: "Item 6", value: 5 },
  //   { label: "Item 7", value: 6 },
  //   { label: "Item 8", value: 7 },
  // ];

  // const dataDetails = [
  //   {
  //     id: 10,
  //     do: "dooo",
  //     schedule: "scheduleeeee",
  //     delegate: "delegateeee",
  //     delete: "deleteeee",
  //   },
  //   { id: 1, do: "@", schedule: "@", delegate: "@", delete: "@" },
  //   { id: 2, do: "-", schedule: "-", delegate: "-", delete: "-" },
  // ];

  const [matrix, setMatrix] = useState(null);
  const [matrixes, setMatrixes] = useState([]); // data
  const [matrixDetails, setMatrixDetails] = useState(null);
  const [loadedMatrixes, setLoadedMatrixes] = useState([]); // make sure "Current" is inclduded initially
  const [isSave, setSave] = useState(false);

  useEffect(() => {
    (async () => {
      await init()
    })()
  }, [])

  async function init() {
    results = await searchMatrixes(); //TODO: setting options

    const data = []
    for (i =0 ; i < results.matrix.length; i++) {
      const m = results.matrix[i]
      if (i === 0 ){ // latest one
        setMatrix({label:"Current", value: m.id})
        data[i] = {label: "Current", value: m.id}
        continue
      }
      date = new Date(m.create_time).toISOString().replace('T', ' ').substring(0, 19);;
      data[i] = {label: date, value: m.id}
    }

    setMatrixes(data)
  }

  useEffect(() => {
    (async () => {
      if (matrix === null) 
        return
      await reloadMatrixDetails();
    })();
  }, [matrix]);

  async function reloadMatrixDetails() {
    let md = null;
    for (const _md of loadedMatrixes) {
      if (_md.id == matrix.value) {
        md = _md;
        break;
      }
    }
    
    if (md === null) {
      result = await getMatrixById(matrix.value);
      md = result.details
    }
    setMatrixDetails(md);
  }

  const handleSave = () => {
    setSave(true);
  };

  const onSave = async(data) => {
    try {
      setMatrixDetails({ ...data });
      setLoadedMatrixes((md) =>{
          return md.map((item) => (item.id === matrix.value ? { ...item, ...data } : item))
        }
      );

      await updateMatrixDetails(matrix.value, data.do, data.schedule, data.delegate, data.delete);

      Toast.show({
          type: "success",
          text1: "Saved 👍🏾",
          autoHide: true,
          visibilityTime: 1500,
          position: "bottom",
      });

    } catch (error) {
      console.error('Error in onSave:', error);
    } finally {
      setSave(false);
    }
  };

  async function handleCreate() {
    try {
      // 1. create 
      await createMatrix()
      // 2. initialise
      await init()
    } catch (error) {
      console.log(error) //TODO: toast
    }
  }

  async function handleArchive() {
    result = await updateMatrix(matrix.value, archive=1)
    await init()
  }

  return (
    <GlobalLayout>
      <View style={styles.headerView}>
        <Dropdown
          style={styles.dropdown}
          data={matrixes}
          labelField="label"
          valueField="value"
          value={matrix}
          onChange={(selectedMatrix) => {
            setMatrix(selectedMatrix);
          }}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={matrix?.label === "Current" ? false : true}
        >
          <Ionicons
            name="save-outline"
            size={30}
            color={ matrix?.label === "Current" ? "black" : "grey"}
          />
        </TouchableOpacity>
      </View>

      <EisenhowerMatrix
        matrixDetails={matrixDetails}
        onSave={onSave}
        isSave={isSave}
      ></EisenhowerMatrix>

      <TouchableOpacity
        style={[styles.CreateButton, styles.button]}
        onPress={handleCreate}
      >
        <Text>Create a new Matrix</Text>
      </TouchableOpacity>

      {matrix?.label !== "Current" ? (
        <TouchableOpacity
          style={[styles.archiveButton, styles.button]}
          onPress={handleArchive}
        >
          <Text>Archive</Text>
        </TouchableOpacity>
       ) : null} 
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 35,
    marginTop: 30,
  },

  saveButton: {
    alignItems: "flex-end",
    backgroundColor: "gold",
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  dropdown: {
    height: 40,
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 8,
    width: "80%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    marginLeft: 35,
    padding: 12,
  },
  CreateButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
  },
  archiveButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "red",
    borderWidth: 0.8,
  },
});
