var gulp = require('gulp');

var releaseOpts = {
	//releaseBranch:'test',
	excludeTask: 'publish'
};

require('./main')(gulp,releaseOpts);
