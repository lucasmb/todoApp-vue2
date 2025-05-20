# todoVue2
This template should help get you started developing with Vue 3 in Vite.

- Realtime Todo APP using vue2
- Backend Node server using Express and SocketIo
- Frontend uses Vuex to centralize events, socket listerners and state managament
- Styled with TailwindCss
- Tasks can be assigned with Prioruty (low, medium, high)
- Tasks can be filtered by active or completed, and sorted by creation date or priorities


## Project Setup

> **Recommended NODE Version** Project was built with Node LTS iron (v20.9.0 or greater)
> this version is recommended for running it locally to import env files nativily

 - Rename `.env.example` file from root dir and backend dir to `.env` and adjust the variablaes value to your project
 - For MONGODB_URI you can use mongodb atlas URL provided in the email

### Frontend
```sh
npm install
```

### Backend
```sh
cd backend
npm install
```


### Compile and Hot-Reload for Development

Open a terminal to run the Node backend

```sh
cd backend
npm run dev
```

then open another termainal into the root folder and start the frontend vue APP with:

```sh
npm run dev
```
