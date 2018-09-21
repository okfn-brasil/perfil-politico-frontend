# Perfil Político

Front-end for [Perfil Político](https://github.com/okfn-brasil/perfil-politico)
 — a platform for profiling candidates in Brazilian 2018 General Election,
 based entirely on open data.

## Requirements

* [Node.js](https://nodejs.org/en/) 10
* `npm` 5+

## Install

```sh
$ npm install
```

## Developing

```sh
$ npm start
```

Then open [`127.0.0.1.xip.io:8080`](http://127.0.0.1.xip.io:8080/)
([more about the `.xip.io` trick](https://github.com/ottoyiu/django-cors-headers/issues/241#issuecomment-315537226)).

## Deploying

```sh
$ npm run build
```

Then serve the contents of the `build/` directory.
