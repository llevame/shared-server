[![Build Status](https://travis-ci.org/llevame/shared-server.svg?branch=master)](https://travis-ci.org/llevame/shared-server) [![codecov](https://codecov.io/gh/llevame/shared-server/branch/master/graph/badge.svg)](https://codecov.io/gh/llevame/shared-server)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

https://llevame-sharedserver.herokuapp.com/api

# shared-server

Shared Server para la aplicación Llevame  

Desarrollado con **NodeJs**, **ExpressJs** como back-end y **ReactJs** como front-end.   

### Correr Servidor

Para ejecutar el servidor y el cliente de **ReactJs** de forma local se necesitan dos terminales y ejecutar los siguientes comandos:

```bash
$ npm install
```
- (para descargar todas las dependencias)

```bash
$ npm start
```
- (para iniciar el shared-server)

**(en otro terminal, y haciendo *cd client*)**

```bash
$ npm install
```
- (para bajar dependencias de *ReactJS*)

```bash
$ npm start
```
- (para iniciar el cliente de *ReactJS*)

#### Correr Tests

```bash
$ npm test
```

#### Docker

Para ejecutar localmente el servidor **NodeJS** mediante *Docker*:

- *docker-compose.yml*: Archivo para configurar el build de *Docker*
- *Dockerfile*: Define qué hacer al momento de correr el conteiner de *Docker* con *Node*

> Repositorio: https://hub.docker.com/r/nflabodocker/taller2.2017.2q/  
> Usuario: nflabodocker

```bash
$ docker pull nflabodocker/taller2.2017.2q
```

Luego de descargarse la imagen, ejecutar:

```bash
$ docker-compose up
```
