var argv = require('yargs').argv;
var fs = require('fs');
var gutil = require('gulp-util');

var throwNoPackageFound = function(pkgName){
	throw new gutil.PluginError({
		plugin: 'release',
		message: 'No '+pkgName+' found!' 
	});
};

var validatePackageExist = function(pkgName){
	if(fs.existsSync(pkgName)){
		return ['./'+pkgName];
	}else{
		throwNoPackageFound(pkgName);
	}
};

var getPackage = function(){
    
    if(argv.bower){
    	return validatePackageExist('bower.json');
    }else if(argv.npm || argv.node){
    	return validatePackageExist('package.json');
    }else{

		if(fs.existsSync('package.json')){
    		return ['./'+'package.json'];
    	}else if(fs.existsSync('bower.json')){
    		return ['./'+'bower.json'];
    	}else{
    		throwNoPackageFound('package.json');
    	}

    }

};

var getPackageVersion = function(){
	var pkg = getPackage();
	return JSON.parse(fs.readFileSync(pkg[0], 'utf8')).version;
};

var defineReleaseType = function(){
	var release_type;
	if(argv.patch){
		release_type = 'patch';
	}else if(argv.minor){
		release_type = 'minor';
	}else if(argv.major){
		release_type = 'major';
	}else{
		release_type = argv.v || 'patch';
	}
	return release_type;
}

module.exports = {
	getPackage:getPackage,
	getPackageVersion:getPackageVersion,
	defineReleaseType:defineReleaseType
};