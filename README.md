# vue-ssr-search-test

[![en](https://img.shields.io/badge/lang-en-green.svg)](https://github.com/DmitriyHoff/vue-ssr-search-test/blob/master/README.md)
[![ru](https://img.shields.io/badge/lang-ru-red.svg)](https://github.com/DmitriyHoff/vue-ssr-search-test/blob/main/README.ru.md)

Search for locations using Nominatim API.

<div align="center">
    <img alt="demo" src="image.gif" width="600" />
</div>

## Brief description of the implementation

In this project, server-side rendering (**SSR**) is implemented using **Node** + **Express.js** , without third-party libraries.

To demonstrate the correct operation of server rendering and the hydration process on the client side, several pages have been added using Vue Router .

**Pinia** is used to manage the application state.

To visualize the search results, it was decided to include the **Leaflet** library. Since Leaflet functions exclusively in the browser, dynamic import of this library is provided in the `onMounted()` Vue hook. This solution ensures that the library is loaded only on the client side, avoiding errors related to the absence of a global object `window` on the server.

## Project preparation

```sh
npm install
```

### Running an application in Hot-Reload mode for development

```sh
npm run dev
```

### Assembling a ready-made solution

```sh
npm run build
```

### Building and running the production version

```sh
npm run preview
```

#### Structure of the finished project:

<div align="left">
    <img alt="demo" src="image2.png" />
</div>
