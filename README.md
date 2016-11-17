# TaskMaster

A Google Chrome extension that will search current assigned tasks assigned to the current user and display them in a popout window. People are able to search other tasks in a project that are assigned to other users.

### Requirements

To get this extension running on your browser you would need the following:

* Node.js and npm
* Ruby and SASS
* [HTTP server](https://www.npmjs.com/package/http-server) (doesn't matter which one)

### Getting Started

Run **'npm install'** to get all packages to get the project running onto your machine

```sh
$ npm install
```

Then in your terminal/console run **'grunt build'** to generate the CSS and JS needed to start the extension.

Finally run your HTTP server and the project to view it.

### Overview

* This project uses [Bourbon and Neat](http://neat.bourbon.io/) for layout. Currently the extension is designed to view at **480 pixels wide**
* Components are being rendered using [react.js](https://facebook.github.io/react/) and have their own JSX file