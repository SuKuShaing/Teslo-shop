<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/logo.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo Api

1. Clonar el proyecto
2. `$ pnpm install`
3. Clonar el `.env.template` y renombrarlo a `.env`
4. Cambiar las variables de entorno
5. Levantar la base de datos

```sh
docker-compose up -d
```

6. Levantar el `pnpm run start:dev`

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
