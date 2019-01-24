[![Build Status](https://travis-ci.org/llevame/shared-server.svg?branch=master)](https://travis-ci.org/llevame/shared-server) [![codecov](https://codecov.io/gh/llevame/shared-server/branch/master/graph/badge.svg)](https://codecov.io/gh/llevame/shared-server) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Docker](https://img.shields.io/badge/docker-using-blue.svg)](https://www.docker.com/)

[![JWT](http://jwt.io/img/badge.svg)](https://jwt.io/)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

https://llevame-sharedserver.herokuapp.com

# shared-server

Shared Server para la aplicación Llevame  

Desarrollado con **NodeJs**, **ExpressJs** como back-end y **ReactJs** como front-end.   

### Correr Servidor

- Dependencias:  
  - *[Node](https://nodejs.org/en/download/)* (también se instala el manejador de paquetes denominado **npm** - Node Package Manager)  
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

- Dependencias
  - *[Docker](https://www.docker.com/community-edition#/download)*  
  - *[Docker Compose](https://docs.docker.com/compose/install/)*

Para ejecutar localmente el servidor **NodeJs** y el cliente (backoffice) **ReactJs** mediante *Docker*:

```bash
$ docker-compose up
```

Si es la primera vez, se descargarán las imágenes de *NodeJs* y *PostgreSQL*, y se creará la imagen del server. A su vez se generarán dos nuevos contenedores (postgres y llevame-server), los cuales se iniciarán.  

Para detener la ejecución simplemente usar la secuencia de teclas: *Ctrl + C*.  

Para reanudar la ejecución, ejecutar *docker-compose up*.  

Para borrar los contenedores ejecutar lo siguiente:  

```bash
$ docker rm llevame-server postgres
```

Si se quire volver a buildear la imagen del server ejecutar:  

```bash
$ docker-compose up --build
```

- Comandos útiles

> Ver contenedores disponibles

```bash
$ docker ps -a
```

> Ver imágenes creadas

```bash
$ docker images
```

### Documentación

- Dependencias
  - *[Doxygen](http://www.stack.nl/~dimitri/doxygen/manual/install.html)*

Para generar la documentación del código se utiliza *Doxygen*, con lo cual, luego de descargar e instarlo desde la [página oficial](http://www.stack.nl/~dimitri/doxygen/manual/install.html), se puede ejecutar lo siguiente:  

```bash
$ doxygen Doxyfile
```
