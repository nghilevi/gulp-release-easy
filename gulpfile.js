var gulp = require('gulp');
require('./main')(gulp,{
	releaseBranch:'test',
	excludeTask: 'publish'
});