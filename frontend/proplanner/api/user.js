
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
    
    return response.json();
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
      
      return response.json();
}