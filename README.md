[![NPM](https://nodei.co/npm/gulp-release-easy.png?compact=true)](https://www.npmjs.com/package/gulp-release-easy)

gulp-release-easy
=========

A gulp plugin that helps you automate releasing and publishing to NPM easy than ever! I've used it in my pet project as well as used it to publish itself!

## Usage
`npm install gulp-release-easy --save-dev`

```javascript
var gulp = require('gulp');
require('gulp-release-easy')(gulp);
```

You can also pass along a config object where you can define your chosen release branch (by default, it will be 'master');
```javascript
// Set 'develop' as the release branch
require('gulp-release-easy')(gulp,{releaseBranch:'develop'});
```

See more about what you can pass in the config object below.

So instead of manually:
pull changes from release branch -> bump version -> commit -> tag -> push to release branch -> publish to NPM

You can just simply issue:
```javascript
gulp release
```

or a full version:
```javascript
gulp release -b my-release-branch --minor --bower
```
### Options

Instead of typing parameters every time you issue `gulp release`, you can set them by default by passing the config object and then simply `gulp release`:
```javascript

// all the properties are optional
require('gulp-release-easy')(gulp,{
	releaseBranch:'develop' // Set 'develop' as the release branch 'master' is default
	releaseType: 'minor' // or 'marjor' or 'patch' (which is default)
	excludeTask: 'publish' // this will do all the tasks but NOT publishing to NPM
});
```
If you want instead want to type in the verbose version of your `gulp release`, you can pass along some parameters, this will override the config options you passed in `gulpfile.js`:

option             | meaning
-----------------|-------------------------------------
gulp-release -b branch-name         | your release branch
gulp-release --minor (or -v minor) | release <b>minor</b> (the same thing with patch and <b>major</b>, default is <b>patch</b>)
gulp-release --bower (or --npm or --node) | choose the package file that you want to update (either <b>npm</b> or <b>bower</b>, default is <b>npm</b>)
gulp-release -x taskName 	| exclude the task during the releasing process, currently only 'publish' can be exceluded

run `gulp -T` for a list of available commands
