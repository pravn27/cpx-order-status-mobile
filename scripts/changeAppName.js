#!/usr/bin/env node

module.exports = function(ctx) {
    // make sure android platform is part of build
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path');

    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
    var stringsFileLocation = path.join(platformRoot, '/res/values/strings.xml');

	var data = fs.readFileSync(stringsFileLocation, 'utf8');
 
    var result = data.replace('HPE-Go', 'HPE Go');
    fs.writeFileSync(stringsFileLocation, result, 'utf8');
	console.log('change of strings file complete');

};