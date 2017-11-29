---
title: Manual de usuario Técnico - Shared Server
header-includes:
    - \usepackage{fancyhdr}
    - \pagestyle{fancy}
    - \fancyhead[LO,CE]{LLevame App}
    - \fancyfoot[CO,CE]{versión en PDF generada a través de Pandoc - https://pandoc.org}
    - \fancyfoot[LE,RO]{\thepage}
abstract: |
	Instrucciones para la instalación y ejecución del shared-server de LLevame
---

Dependencias
------------

- **Node.js** (JavaScript runtime construído sobre el motor V8 de Chrome)(se pude descargar e intalar desde https://nodejs.org/en/download/)  
- **Git** (CVS)(se puede descargar e instalar desde https://git-scm.com/downloads)  
- **Docker** (Despliegue de aplicaciones dentro de contenedores de software)(se puede descargar e instalar desde https://www.docker.com/community-edition#/download)

Descargar
---------

```bash
$ git clone https://github.com/llevame/shared-server.git

$ cd shared-server
```

Instalar dependencias
---------------------

- Instala las dependencias tanto para el servidor como para el cliente (backoffice).

```bash
$ npm run installDep
```

Ejecutar
--------

- Servidor (*ExpressJs*) y cliente (*ReactJs*). Ejecuta concurrentemente ambas aplicaciones (abre una nueva pestaña en el explorador predeterminado).

```bash
$ npm start
```

- Servidor (*ExpressJs*). Ejecuta solamente el servidor.

```bash
$ npm run server
```

- Cliente - Backoffice (*ReactJs*). Ejecuta solamente el cliente (abre una nueva pestaña en el explorador predeterminado).

```bash
$ npm run client
```

Tests
-----

```bash
$ npm test
```

Docker
------

- *docker-compose.yml*: archivo para configurar el build de *Docker*
- *Docker*: define qué hacer al momento de ejecutar el conteiner de Docker con NodeJs

Si se quiere ejecutar el servidor *NodeJs* mediante *Docker* se pueden seguir los siguientes pasos:  

```bash
$ docker pull nflabodocker/taller2.2017.2q
```

Luego de que se haya descargado la imagen, ejecutar:

```bash
$ docker-compose up
```
