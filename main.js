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
	var pkg = helper.getPackage()  || opts.pkg || ['package.json'];
	var origin =  argv.o  || opts.origin || 'origin';

	//TODO: xclude task + readme
	gulp.task('noop', []);

	gulp.task('pull-changes', function(cb) {
		var origin = 'origin';
	    git.pull(origin, defaultReleaseBranch, cb);
	});

	gulp.task('bump',function () {
	    return gulp.src(helper.getPackage())
	        .pipe(bump({type: releaseType}))
	        .pipe(gulp.dest('./'));
	});

	gulp.task('commit-changes', function (cb) {
	    var version = helper.getPackageVersion(pkg);
	    var message = 'Release v' + version;
	    return gulp.src('.')
	        .pipe(git.add())
	        .pipe(git.commit(message))
	        .pipe(git.tag(version, 'Release v' + version, cb))
	        .pipe(git.push('origin', defaultReleaseBranch, cb))
	        .pipe(git.push('origin', defaultReleaseBranch, {args: '--tags'}, cb));
	});



	gulp.task('publish', function (cb) {
	    require('child_process').exec('npm publish', cb);
	});

	gulp.task('release', function(cb) {
		var tasks = [
			'pull-changes',
			'bump',
			'commit-changes',
			excludeTask === 'publish' ? 'noop' : 'publish',
			cb
		];
		return runSequence.apply(this,tasks);
	});
}



