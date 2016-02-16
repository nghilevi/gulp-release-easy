var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var git = require('gulp-git');
var argv = require('yargs').argv;
var gutil = require('gulp-util');

var helper = require('./helper');

module.exports = function(gulp,opts){

	var opts = opts || {};
	
	var origin =  argv.o  || opts.origin || 'origin';
	var defaultReleaseBranch = argv.b || opts.releaseBranch || 'master';
	var releaseType = helper.defineReleaseType() || opts.releaseType || 'patch';
	var excludeTask = argv.x || opts.excludeTask;
	var pkg = helper.getPackage()  || opts.pkg || ['package.json'];
	
	var version, message;

	var updateVersion = function(){
		version = helper.getPackageVersion(pkg);
		message = 'Release v' + version;		
	}
	//TODO: better xclude tasks + readme
	
	gulp.task('noop', []);

	gulp.task('pull-changes', function(cb) {
	    git.pull('origin', defaultReleaseBranch, cb);
	});

	gulp.task('bump',function () {
	    return gulp.src(helper.getPackage())
	        .pipe(bump({type: releaseType}))
	        .pipe(gulp.dest('./'));
	});

	gulp.task('commit-changes', function () {
	    return gulp.src('.')
	        .pipe(git.add())
	        .pipe(git.commit(message));
	});
	
	gulp.task('tag-changes', function(cb) {
	    git.tag(version, 'Release v' + version,cb)
	});

	gulp.task('push-changes', function(cb) {
	    git.push('origin', defaultReleaseBranch, cb);
	});

	gulp.task('push-tag', function (cb) {
	    git.push('origin', defaultReleaseBranch, {args: '--tags'}, cb);
	});

	gulp.task('publish', function (cb) {
	    require('child_process').exec('npm publish', cb);
	});

	gulp.task('release', function(cb) {
		updateVersion();
		var tasks = [
			'pull-changes',
			'bump',
			'commit-changes',
			'tag-changes',
			'push-changes',
			'push-tag',
			excludeTask === 'publish' ? 'noop' : 'publish',
			cb
		];
		return runSequence.apply(this,tasks);
	});
}



