var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var git = require('gulp-git');
var argv = require('yargs').argv;

var helper = require('./helper');

module.exports = function(gulp,config){

	var config = config || {};
	var defaultReleaseBranch = argv.b || config.releaseBranch || 'master';
	var releaseType = helper.defineReleaseType() || config.releaseType || 'patch';
	var excludeTask = argv.x || config.excludeTask;

	//TODO: add config for package.json

	var release = function(version, cb) {
		if(excludeTask === 'publish'){
			runSequence(
		        'pre-publish',
		        cb
		    );		
		}else{
			runSequence(
		        'pre-publish',
		        'publish',
		        cb
		    );	
		}
	};
	
	gulp.task('pre-publish', function(cb) {
		return	runSequence(
		        'pull-changes',
		        'bump',
		        'commit-changes',
		        'create-tag',
		        'push-changes',
		        'tag',
		        cb
		);
	});

	gulp.task('pull-changes', function(cb) {
	    git.pull('origin', defaultReleaseBranch, cb);
	});

	gulp.task('bump',function () {
	    return gulp.src(helper.getPackage())
	        .pipe(bump({type: releaseType}))
	        .pipe(gulp.dest('./'));
	});

	gulp.task('commit-changes', function () {
	    var version = helper.getPackageVersion();
	    var message = 'Release v' + version;
	    return gulp.src('.')
	        .pipe(git.add())
	        .pipe(git.commit(message));
	});

	gulp.task('create-tag', function(cb) {
	    var version = helper.getPackageVersion();
	    git.tag(version, 'Release v' + version, cb);
	});

	gulp.task('push-changes', function(cb) {
	    git.push('origin', defaultReleaseBranch, cb);
	});

	gulp.task('tag', function (cb) {
	    git.push('origin', defaultReleaseBranch, {args: '--tags'}, cb);
	});

	gulp.task('publish', function (cb) {
	    require('child_process').exec('npm publish', cb);
	});

	gulp.task('release', function(cb) {
	    release(releaseType, cb);
	});
}



