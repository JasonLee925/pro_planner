import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GlobalLayout } from "../../components/Layout";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { EisenhowerMatrix } from "../../components/Matrix";
import Toast from "react-native-toast-message";
import { searchMatrixes, getlatestMatrix, getMatrixById, createMatrix, updateMatrix, updateMatrixDetails } from "../../api/matrix";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MATRIX_SETTINGS } from "@/constants/AsyncStorage"

export default function HomeScreen() {

  const [matrix, setMatrix] = useState(null);
  const [matrixes, setMatrixes] = useState([]); // data
  const [matrixDetails, setMatrixDetails] = useState(null);
  const [loadedMatrixesDetails, setLoadedMatrixesDetails] = useState([]); 
  const [isSave, setSave] = useState(false);
  const [dropdownFocus, setDropdownFocus] = useState(false);

  useEffect(() => {
    (async () => {
      await init(await getSettings())
    })()
  }, [])

  async function init(settings=null) {
    results = await searchMatrixes(settings); 

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
      if (!dropdownFocus) return
      const settings = await getSettings()
      if (settings) await init(settings)
    })()
  }, [dropdownFocus])

  async function getSettings() {
    let json = await AsyncStorage.getItem(MATRIX_SETTINGS);
    const settings = json != null ? JSON.parse(json) : null;

    if (settings === null) return null
    if (settings.changed == 0) return null

    const modified = { ...settings, changed: 0}
    json = JSON.stringify(modified);
    await AsyncStorage.setItem(MATRIX_SETTINGS, json);  
    return modified
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
    for (const _md of loadedMatrixesDetails) {
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
      setLoadedMatrixesDetails((md) =>{
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
      await init(await getSettings())
    } catch (error) {
      console.log(error) //TODO: toast
    }
  }

  async function handleArchive() {
    result = await updateMatrix(matrix.value, archive=1)
    await init(await getSettings())
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
          onFocus={() => setDropdownFocus(true)}
          onBlur={() => setDropdownFocus(false)}
          onChange={(selectedMatrix) => {
            setMatrix(selectedMatrix);
            setDropdownFocus(false);
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
