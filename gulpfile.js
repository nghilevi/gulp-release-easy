var gulp = require('gulp');

var releaseOpts = {
	//releaseBranch:'develop',
	excludeTask: 'publish'
};

require('./main')(gulp,releaseOpts);
