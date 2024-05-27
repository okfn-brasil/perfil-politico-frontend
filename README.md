# Perfil Político

Front-end for [Perfil Político](https://github.com/okfn-brasil/perfil-politico)
 — a platform for profiling candidates in Brazilian 2022 General Election,
 based entirely on open data.

## Prerequisites

* [Node.js](https://nodejs.org/en/) 16
* `npm` 8.17+

You can use `nvm` to manage multiple installations of node.js on your computer (check nvm installation guides for MacOS
and Linux [here](https://github.com/nvm-sh/nvm) and for Windows [here](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows)).

Once you have it, you can use the right node version for the project and update `npm` using these commands:

```sh
nvm install 16
nvm use 16
npm -g update npm
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

It will make your website available here: [`localhost:8080`](http://localhost:8080/)

### Compiles and minifies for production
```
npm run build
```

Then serve the contents of the `dist/` directory.

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

