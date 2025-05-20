# todoApp Vue2
This template should help get you started developing with Vue 3 in Vite.

- Real time Todo APP using vue2
- Backend Node server using Express and SocketIo and mongodb
- Frontend uses Vuex to centralize events, socket listeners and state management
- Styled with TailwindCss
- Animations with AnimateJs
- Tasks can be assigned with Priority (low, medium, high)
- Tasks can be filtered by active or completed, and sorted by creation date or priorities


## Project Setup

> **Recommended NODE Version** Project was built with Node LTS iron
> this version  (v20.9.0 or greater) is recommended for running it locally to import env files without external libraries


 - Rename `.env.example` file from root dir and backend dir to `.env` and adjust the variables value to your project
 - For MONGODB_URI you can use your own mongodb atlas URL or the one provided here

#### Frontend
```sh
npm install
```

#### Backend
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

then open another terminal into the root folder and start the frontend vue APP with:

```sh
npm run dev
```
