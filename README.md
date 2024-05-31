# The Purpose 💥

This mobile app aims at resolving procrastination. It helps people to plan their daily tasks using [Eisenhower Matrix](https://asana.com/resources/eisenhower-matrix) (or Priority Matrix).

# Features ✨
*The data are stored in local storage using **AsyncStorage API**.

| Items            | Features                             | description                                                                                                                                                         |
| ---------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login Page       | Login\*                              | Login with email and password                                                                                                                                       |
|                  | Sign up                              | Create a new account                                                                                                                                                |
| Plan Page (Main) | The matrix                           | This is where a user enters tasks.                                                                                                                                  |
|                  | Save button                          | Press this button to save the matrix                                                                                                                                |
|                  | Dropdown list of history matrixes    | List out all the matrixes a user has created before. </br>They are labelled by datetime and the default size of the list is 5 (this can be modify in Setting page). |
|                  | Create matrix button                 | Create a new matrix.                                                                                                                                                |
|                  | Archive matrix button                | Archive a matrix.                                                                                                                                                   |
| About Page       | About                                | Information about the app, Eisenhower Matrix, and **the list of open source license**                                                                               |
| Settings Page          | Showing archived matrixes Switcher\* | If it's ON, the app will query archived matrixes and include them in the dropdown list in Plan page.                                                                |
|                  | Number of showing matrixes\*         | The number of showing matrixes in the dropdown list in Plan page.                                                                                                   |
|                  | Logout button                        | Logout! This will remove all settings stored at local storage.                                                                                                      |
|                  | Delete Account button                | Delete account. This will remove not only the data from the database but also the settings stored at local storage.                                                 |

# Dependencies & How to install them ✅

### Dependencies

To check out the dependencies that are used in this project, kindly refer to [package.json](package.json).

### How to install dependencies?

1. Open a terminal (or command line in Windows OS)
1. Change directory to the project folder

   ```shell
   cd portfolio_react-main/
   ```

1. Install dependencies

   ```shell
   npm install
   ```

# How to start 🛫

1. After installed the dependencies, you will have to fill up `.env` for both backend and frontend servers. The formats are provided as below:
    
    - Backend:

        ```
        DB_HOST=
        DB_NAME=
        DB_USER=
        DB_PWS=
        DB_PORT=
        SECRET_KEY=
        ```

    - Frontend:

        ```
        EXPO_PUBLIC_BASE_URL=
        ```

1. Start by navigating to the backend and frontend directory and run the following commends respectively.

    - Backend:
        ```
        npm run dev
        ```

    - Frontend: 
        ```shell
        npx expo start
        ```

# Application Architecture 🏗️

- Backend

    1. `app.js` acts as a server entry point.
    1. `db.js` includes database settings.
    1. Use Node.js with Express.js as a server side foundation. All main codes and logics are in `/routes` folder:
        - `matrixes.js` where main matrix APIs are stored. It corresponds to *Plan Page* in the app.
        - `users.js` stores all user-related APIs.
        - `auth.js` takes care of token verification. It is used as a middleware for other APIs.  

- Frontend
    The architecture of the application follows React Native framework and was created by Expo (version: 51). 
    - `/api` stores the functions to make API calls.
    - `/app` stores page files (follow the [Expo Tab structure](https://docs.expo.dev/router/advanced/tabs/))
    - `/assests` stores images, licence file, etc.
    - `/components` where the defualt components (created by Expo 51) and custom ccomponents are stored.
    - `constants` where it stores constant variables.
    - `constants` where the defualt hooks (created by Expo 51) are stored.


# How to contribute? 🤲🏻

To make a contribution, the first thing you should do is to fork the repository by clicking on the 'Fork' button at the top-right of the page. After making changes on your forked repo, create a PR (pull request) to the original repo and assign the reviewer as the repo owner. The owner may or may not accept your PR depending on the changes you made.

# How to report issues? 🚨

To report an issue, click on the 'Issus' tab and create a new issue.
