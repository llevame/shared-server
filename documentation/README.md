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
- **PostgreSQL** (gestor de Base de Datos SQL)(se puede descargar e instalar desde https://www.postgresql.org/download/)
- **Doxygen** (generador de documentación del código)(descargar e instalar desde http://www.stack.nl/~dimitri/doxygen/manual/install.html)

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

Documentación
-------------

Para generar la documentación del código se necesita Doxigen que se puede descargar e instalar desde la página oficial detallada arriba.  
Luego, ejecutar lo siguiente:  

```bash
$ doxygen Doxyfile
```