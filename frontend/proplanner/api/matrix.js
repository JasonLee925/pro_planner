import AsyncStorage from '@react-native-async-storage/async-storage';


export async function searchMatrixes(settings=null) {
    const userToken = await AsyncStorage.getItem('user-token');
    const auth = `Bearer ${userToken}`

    let params = {limit: 5, archived: 0} // default
    if (settings) {
        params = { limit: settings.limit, archived: settings.archived }
    }
    const queryString = new URLSearchParams(params).toString();

    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/matrixes/search?${queryString}`;

    try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: auth,
            },
        })
        resp = await response.json()
        if (!resp || !resp.matrix) {
            console.error('Error: Invalid response from searchMatrixes');
            return;
        }
        return resp
    } catch(error) {
        throw error;
    }
}

export async function getlatestMatrix(isDetails=1) {
    const userToken = await AsyncStorage.getItem('user-token');
    const auth = `Bearer ${userToken}`

    const params = {details: isDetails}
    const queryString = new URLSearchParams(params).toString();

    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/matrixes/latest?${queryString}`;

    try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: auth,
            },
        })
        return await response.json();
    } catch(error) {
        throw error;
    }
}


export async function getMatrixById(id, isDetails=1) {
    const userToken = await AsyncStorage.getItem('user-token');
    const auth = `Bearer ${userToken}`

    const params = {details: isDetails}
    const queryString = new URLSearchParams(params).toString();

    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/matrixes/${id}?${queryString}`;

    try{
        const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: auth,
            },
        })
        return await response.json();
    } catch(error) {
        throw error;
    }
}


export async function createMatrix( doText=null, scheduleText=null, delegateText=null, deleteText=null) {
    const userToken = await AsyncStorage.getItem('user-token');
    const auth = `Bearer ${userToken}`

    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/matrixes`;
    const json = {
        do: doText,
        schedule: scheduleText,
        delegate: delegateText,
        delete: deleteText,
      };
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: auth,
            },
            body: JSON.stringify(json),
        })
        return await response.json();
    } catch(error) {
        throw error;
    }
}

export async function updateMatrix( id, archive=0 ) {
    const userToken = await AsyncStorage.getItem('user-token');
    const auth = `Bearer ${userToken}`

    const queryString = new URLSearchParams({archive}).toString();
    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/matrixes/${id}?${queryString}`;
    try{
        const response = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: auth,
            },
        })
        return await response.json();
    } catch(error) {
        throw error;
    }
}

export async function updateMatrixDetails( id, doText=null, scheduleText=null, delegateText=null, deleteText=null) {
    const userToken = await AsyncStorage.getItem('user-token');
    const auth = `Bearer ${userToken}`

    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/matrixes/${id}/details`;
    const json = {
        do: doText,
        schedule: scheduleText,
        delegate: delegateText,
        delete: deleteText,
      };
    try{
        const response = await fetch(url, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              Authorization: auth,
            },
            body: JSON.stringify(json),
        })
        return await response.json();
    } catch(error) {
        throw error;
    }
}

