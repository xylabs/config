[![logo][]](https://xylabs.com)

# Typescript Project Scripts

## Description

> Scripts that are used to develop, build, and analyze Typescript projects.  Can be used directly for generating esm modules.

## Required Tools (Global)

-   [Visual Studio Code](https://code.visualstudio.com)
-   [NPM](https://www.npmjs.com)
-   [Git](https://git-scm.com/)
-   [Yarn](https://yarnpkg.com/)

## Tools

-   [ESLint](https://eslint.org)
-   [TypeScript](https://www.typescriptlang.org)
-   [Depcheck](https://www.npmjs.com/package/depcheck)
-   [TS-Prune](https://www.npmjs.com/package/ts-prune)
-   [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

## Global Configuration

-   Install Visual Studio Code (vsCode)
-   Install NPM (Node.js)
-   Install Yarn
-   Install Git

## Project Scripts

### build
> Builds the package (lint and compile)

### clean
> Removes all non-source files that are created during a builds

### compile
> Compile the package

### cycle
> Uses ESLint to check for code cycles up to 10 levels deep

### dead
> Uses TS-Prune to display all unused exports

### deps
> Displays all dependencies that have a new version available on npmjs

### deploy
> Deploy the package to NPMJS

### fix
> Fixes all lint issues that can be automatically fixed using ESLint/Prettier

### lint
> Lint the package using ESLint/Prettier

### resintall
> Deletes the node_modules folder and installs all dependencies

### up
> Displays all dependencies with stale versions in package.json

### updo
> Updates package.json to reflect actual version of dependencies being used

## Maintainers

-   [Arie Trouw](https://arietrouw.com) ([Github](https://github.com/arietrouw))

## License

See the [LICENSE](LICENSE) file for license details

## Credits

[Made with 🔥 and ❄️ by XY Labs](https://xylabs.com)

[logo]: https://cdn.xy.company/img/brand/XYPersistentCompany_Logo_Icon_Colored.svg
