# Perfil Político

Front-end for [Perfil Político](https://github.com/okfn-brasil/perfil-politico)
 — a platform for profiling candidates in Brazilian 2018 General Election,
 based entirely on open data.

## Prerequisites

* [Node.js](https://nodejs.org/en/) 10
* `npm` 5+

You can use `nvm` to manage multiple installations of node.js on your computer (check nvm instalattion guides for MacOS
and Linux [here](https://github.com/nvm-sh/nvm) and for Windows [here](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows)).

Once you have it, you can use the right node version for the project using these commands:

```sh
nvm install 10.0.0
nvm use 10.0.0
````

## Install

```sh
$ npm install
```

## Developing

```sh
$ npm start
```

It will make your website available here: [`127.0.0.1.xip.io:8080`](http://127.0.0.1.xip.io:8080/)
([more about the `.xip.io` trick](https://github.com/ottoyiu/django-cors-headers/issues/241#issuecomment-315537226)).

## Deploying

To create a deploy of your app, use the command:

```sh
$ npm run build
```

Then serve the contents of the `build/` directory.
