# Algotrasoft Community

A community site for algorithmic traders built with Vue 3, Vite and Tailwind CSS.

The homepage introduces the community and its activities. Registered users can open the scanner page, which lists the backtest results of the Ross Hook strategy: each card shows the stock name, its symbol and the yearly annual percentage yield (APY). Clicking a card opens the details page with the sector, market, market capitalization and the 1, 3 and 6 month results. The data is served from a Firebase Realtime Database; authentication uses Firebase Authentication (email and password).

<hr>
<div align="center">
This app is also developed on Angular and React JS with typescript and tailwind. Click the links below to view.

<b>Angular Version:</b> https://github.com/ahmetcankaratas/algotrasoft-community-angular

<b>React Version:</b> https://github.com/ahmetcankaratas/algotrasoft-community

</div>
<hr>

## **🔎 Technologies**

- Vue 3 (`<script setup>`, Composition API)
- Vite
- TypeScript
- Vue Router
- Pinia
- Tailwind CSS v4
- axios
- Vitest and Vue Test Utils
- ESLint, oxlint and Prettier

## **✨ Features**

- Sign up, login, logout and automatic login from the stored session, with automatic logout when the token expires
- Route guard that keeps the scanner behind authentication
- Scanner list with name filtering; result cards and their details are fetched lazily as they scroll into view
- Details page with info rows and bar graphs, including not-found and error states
- Dark and light theme, persisted in local storage
- Responsive header with a mobile menu
- Not-found page for unknown routes

## 📷 Screenshots

<b>Homepage</b>
<img width="1440" alt="Homepage hero" src="https://user-images.githubusercontent.com/53529387/213702150-6b7839c2-ca11-4dbb-827e-b486ce4a24d9.png">

<img width="1440" alt="Homepage sections" src="https://user-images.githubusercontent.com/53529387/209869267-e8b3d104-7ede-4eb4-96cc-253dbd2b81c1.png">

<b>Scanner</b>
<img width="1440" alt="Scanner list" src="https://user-images.githubusercontent.com/53529387/209869386-5f2a2c6c-b267-4a82-b059-1c26304b6a64.png">

<img width="1438" alt="Scanner details" src="https://user-images.githubusercontent.com/53529387/209869403-c0fc9db0-8419-4393-b37e-e0dd5579d997.png">

## **🚀 Getting Started**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js 20 or newer (the project is developed on Node 26)
- Yarn

### Installation

A step by step guide that will tell you how to get the development environment up and running.

- Clone the repository

```sh
git clone https://github.com/ahmetcankaratas/algotrasoft-community-vue
```

- Install dependencies

```sh
cd algotrasoft-community-vue
yarn
```

- Create a `.env.local` file like `.env.example` in the project root. `VITE_FIREBASE_API_KEY` is a Firebase Web API Key which can be taken from the [Firebase console](https://console.firebase.google.com/) in project settings. `VITE_FIREBASE_DATABASE_URL` is the Realtime Database URL of the same project. `.env.local` is gitignored.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_DATABASE_URL=
```

- Build and run the project

```sh
yarn dev
```

Navigate to `http://localhost:5173`

### Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `yarn dev`        | Start the development server with hot reload     |
| `yarn build`      | Type-check and build for production into `dist/` |
| `yarn preview`    | Serve the production build locally               |
| `yarn test:unit`  | Run the unit tests with Vitest                   |
| `yarn type-check` | Type-check with `vue-tsc`                        |
| `yarn lint`       | Lint and auto-fix with oxlint and ESLint         |
| `yarn format`     | Format the sources with Prettier                 |

## **📁 Project Structure**

```
src/
  assets/        global styles and images
  components/    reusable components (layout, home, scanner, alerts)
  composables/   reusable composition functions (request status)
  directives/    custom directives (visibility observer)
  router/        routes, guards and scroll behavior
  services/      HTTP layer (auth, data storage, token interceptor)
  stores/        Pinia stores (auth, theme, results)
  types/         shared TypeScript interfaces
  utils/         pure helpers (validation, filtering, error messages)
  views/         route components
```

## **🛠 Recommended IDE Setup**

[VS Code](https://code.visualstudio.com/) with the [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension.
