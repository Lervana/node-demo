# node-demo

## Prerequisites

- Node version at least 10.15.3;
- PostgreSQL database
- Yarn
- Docker if you want to use it to have DB

## Dev environment:

1. Create .env file with variables from .env.example.
2. Run "yarn install".
3. Run "yarn dc:up" [it will use docker to set create database].
4. If you have empty database then run "yarn db:m".
5. Run "yarn dev".

## Prod environment:

1. Run "yarn build".
2. Run "yarn dc:up" [it will use docker to set create database].
3. If you have empty database then run "yarn db:m".
4. Run "yarn prod source.json" where source.json is a path to source file.

**Result file will be generated in node-demo dir.**

## package.json scripts

| Command            |                             Description                             |
| ------------------ | :-----------------------------------------------------------------: |
| **dev**            |                   Starts development environment                    |
| **prod**           |                      Starts production script                       |
| **build**          |                          Builds production                          |
| **lint**           |                             Runs linter                             |
| **format:fix**     |                          Fixes formatting                           |
| **clean:dist**     |                        Cleans dist directory                        |
| **clean:build**    |                       Cleans build directory                        |
| **clean**          |                    Cleans dist & build directory                    |
| **db:m**           |                         Runs DB migrations                          |
| **db:m:u**         |                       Undo all DB migrations                        |
| **db:reset**       |                              Resets DB                              |
| **dc:up**          |                     Starts PostgreSQL in docker                     |
| **test**           |                      Runs tests in watch mode                       |
| **coverage**       |                Run tests and creates coverage report                |
| **coverage:watch** | Run tests and creates coverage report on every tests or src changes |
