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

- **Node.js** - [https://nodejs.org/en/download](https://nodejs.org/en/download/)  
- **Git** - [https://git-scm.com/downloads](https://git-scm.com/downloads)  
- **Docker** - [https://www.docker.com/community-edition#/download](https://www.docker.com/community-edition#/download)  
- **Docker Compose** - [https://docs.docker.com/compose/install](https://docs.docker.com/compose/install/)  
- **PostgreSQL** - [https://www.postgresql.org/download](https://www.postgresql.org/download/)  
- **Doxygen** - [http://www.stack.nl/~dimitri/doxygen/manual/install.html](http://www.stack.nl/~dimitri/doxygen/manual/install.html)

Descargar
---------

```bash
		$ git clone https://github.com/llevame/shared-server.git

		$ cd shared-server
```

Instalar dependencias
---------------------

- Node.js (tanto para el server como para el cliente de *ReactJs*).

```bash
		$ npm run installDep
```

- PostgreSQL

Es recomendable instalar junto con el gestor *PostgreSQL*, la herramienta gráfica *PgAdminIII* para poder gestionar las distintas bases de datos y tablas de cada una de ellas (disponible en todas las plataformas). Asegurarse de configurar el puerto del servidor de PostgreSQL en 5432 (en general, éste es el puerto por defecto).  

Luego, crear dos base de datos: *llevame-server* y *llevame-server-test*. 

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

Para ejecutar localmente el servidor **NodeJs** y el cliente (backoffice) **ReactJs** mediante *Docker*:

```bash
		$ docker-compose up
```

Si es la primera vez, se descargarán las imágenes de *NodeJs* y *PostgreSQL*, y se creará la imagen del server. A su vez, se generarán dos nuevos contenedores: *postgres* y *llevame-server*, los cuales se iniciarán.  

Para detener la ejecución simplemente usar la secuencia de teclas: *Ctrl + C*.  

Para reanudar la ejecución, ejecutar **docker-compose up**.  

Para borrar los contenedores ejecutar lo siguiente:  

```bash
		$ docker rm llevame-server postgres
```

Si se quisiera ejecutar nuevamente el servidor y cliente, ejecutar **docker-compose up**.  

Si se quire volver a generar la imagen del server (*NodeJs*) ejecutar:  

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

Documentación
-------------

Para generar la documentación del código se necesita Doxigen que se puede descargar e instalar desde la página oficial detallada arriba.  
Luego, ejecutar lo siguiente:  

```bash
		$ doxygen Doxyfile
```
