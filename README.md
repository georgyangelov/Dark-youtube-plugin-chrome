# Dark YouTube plugin for Chrome
[![Build Status](https://travis-ci.org/georgyangelov/Dark-youtube-plugin-chrome.svg?branch=master)](https://travis-ci.org/georgyangelov/Dark-youtube-plugin-chrome)

A plugin that changes the Youtube skin to a black one.
Perfect for watching videos when it's dark.

# Build

## Setup

1. Install latest stable `Node.js`
2. `npm install -g gulp-cli`
3. `npm install`
4. Run `gulp` for automatic build-on-change and css lint
5. Load the plugin in Chrome from the `build` directory

## CSS processing

The CSS files use SCSS and must be named `src/styles/<component-or-page>.css.scss`.
Any mixins reside in `src/styles/_mixins.scss` and the variables are in `src/styles/_variables.scss`.

**Do not add color literals (hex or rgba) in any file except `_variables.scss`.**
If possible, use the already existing colors there and "remix" them with functions such as
`rgba($color, 0.4)`, `lighten($color, 30%)` and `darken($color, 20%)`.

At the start of each new scss file put `@import 'common';`, which imports the variables and the mixins.

# Contribution guide

1. Clone the project
2. Follow the `Setup` instructions above
3. Make changes
4. Make sure there are no lint errors (`gulp lint` must not give warnings)
5. Test the changes in your browser (don't forget to reload the plugin)
6. Submit a PR with a short description **and a screenshot of the change**
