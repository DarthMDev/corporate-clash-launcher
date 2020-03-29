# Archived

We've shifted development to a native, QT-based python app since Electron is too heavyweight for something as simple as a launcher.

## Corporate Clash Electron Launcher

This launcher is meant to ease development by utilizing Vue, Typescript, and vue cli.

### Goals

* Implement new Launcher authentication process (persistent login tokens [kinda])
* Make adding new features easy
* Support both QA and Production while requiring an authenticated account to download QA/see QA option




## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
