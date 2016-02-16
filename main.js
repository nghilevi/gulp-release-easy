var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var git = require('gulp-git');
var argv = require('yargs').argv;
var gutil = require('gulp-util');

var helper = require('./helper');

module.exports = function(gulp,opts){

	var opts = opts || {};
	var defaultReleaseBranch = argv.b || opts.releaseBranch || 'master';
	var releaseType = helper.defineReleaseType() || opts.releaseType || 'patch';
	var excludeTask = argv.x || opts.excludeTask;

	//TODO: add opts for package.json

	var release = function(version, cb) {
		runSequence(
	        'pre-publish',
	        excludeTask === 'publish' ? gutil.noop() : 'publish',
	        cb
		);	
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



