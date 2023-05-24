<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Proyecto de Arquitectura Hexagonal
Este es un proyecto de ejemplo que muestra la implementación de una arquitectura hexagonal en una aplicación.

Descripción
La arquitectura hexagonal, también conocida como puertos y adaptadores, es un enfoque de diseño de software que busca separar las preocupaciones y lograr una mayor modularidad y flexibilidad en la aplicación.

En este proyecto, seguimos los principios de la arquitectura hexagonal para organizar nuestra aplicación en capas y establecer una clara separación de responsabilidades.

## Estructura del Proyecto
El proyecto se divide en las siguientes carpetas principales:

* src: Contiene el código fuente de la aplicación.
* * application: Aquí se encuentran los casos de uso de la aplicación.
* * domain: Contiene las entidades y objetos de valor del dominio.
* * infrastructure: Esta carpeta contiene las implementaciones concretas de los puertos definidos en el dominio, así como otros detalles de infraestructura
* * api: puente de entrada, controladores
## Tecnologías Utilizadas
***

* NestJS: Framework de Node.js para construir aplicaciones escalables y modulares.
* TypeScript: Lenguaje de programación que agrega tipado estático opcional a JavaScript.
* Redis
* Postgres
* JWT




## Pasos de Instalacion Local

## Clona el repositorio en tu máquina local:
```bash
git clone git@github.com:josmel/challenge-lucky.git
```
## Navega hasta el directorio del proyecto::
```bash
cd challenge-lucky
```
## Generar .env::
```bash
cp .env.example .env
```
## Installation
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Uso con Docker Compose
El proyecto también puede ejecutarse utilizando Docker Compose, lo que facilita la configuración y la ejecución del entorno de desarrollo.


Asegúrate de tener instalado Docker y Docker Compose en tu máquina antes de seguir estos pasos.

1. Clona el repositorio en tu máquina local:
```bash
git clone git@github.com:josmel/challenge-lucky.git
```
2. Navega hasta el directorio del proyecto::
```bash
cd challenge-lucky
```
## Generar .env::
```bash
cp .env.example .env
```

3. Abre el archivo docker-compose.yml y verifica la configuración de los servicios.

4. Ejecuta el siguiente comando para levantar los contenedores:
```bash
docker-compose up -d
```
Esto creará y levantará los contenedores definidos en el archivo docker-compose.yml.

5. Accede a la aplicación en tu navegador en la siguiente URL: http://localhost:3000/api/v1. Puedes abrir  la documentacion en swagger de las apis en la ruta.

```bash
http://localhost:3000/api/v1
```

6. Para detener y eliminar los contenedores, ejecuta el siguiente comando:
```bash
docker-compose down

```

## License

Nest is [MIT licensed](LICENSE).
