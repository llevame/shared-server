[![Build Status](https://travis-ci.org/llevame/shared-server.svg?branch=master)](https://travis-ci.org/llevame/shared-server) [![codecov](https://codecov.io/gh/llevame/shared-server/branch/master/graph/badge.svg)](https://codecov.io/gh/llevame/shared-server)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

https://llevame-sharedserver.herokuapp.com/api

# shared-server

Shared Server para la aplicación Llevame  

Desarrollado con **NodeJs**, **ExpressJs** como back-end y **ReactJs** como front-end.   

### Correr Servidor

- Dependencias:  
  - *[Node](https://nodejs.org/en/download/)* (también se instala el manejador de paquetes denominado **npm** - Node Package Manager)  
  - *[Docker](https://www.docker.com/community-edition#/download)*  
  - *[PostgreSQL](https://www.postgresql.org/download)* (recomendable: instalar *PgAdminIII* - interfaz gráfica para gestionar las distintas base de datos y sus tablas)

Para ejecutar el servidor **ExpressJs** y el cliente de **ReactJs** de forma local se necesitan ejecutar los siguientes comandos:

```bash
$ npm run installDep
```
- (para descargar todas las dependencias - tanto en el servidor como en el cliente)

```bash
$ npm start
```
- (para iniciar simultáneamente el shared-server y el backoffice de *ReactJs* en el explorador predeterminado)

```bash
$ npm run server
```
- (para iniciar solamente el shared-server)

```bash
$ npm run client
```
- (para iniciar solamente el backoffice de *ReactJs* en el explorador predeterminado)

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
