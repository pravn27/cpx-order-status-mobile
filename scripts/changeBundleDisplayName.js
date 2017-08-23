#!/usr/bin/env node

module.exports = function(ctx) {
    // make sure android platform is part of build
    if (ctx.opts.platforms.indexOf('ios') < 0) {
        return;
    }
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path');

    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/ios');
    var stringsFileLocation = path.join(platformRoot, '/HPE-Go/HPE-Go-Info.plist');
	
	var regex = new RegExp(/.*key.*CFBundleDisplayName.*\s.*string.*PRODUCT_NAME.*string.*/);
	var replace = "<key>CFBundleDisplayName</key>\n<string>HPE Go</string>"

	var data = fs.readFileSync(stringsFileLocation, 'utf8');
 
    var result = data.replace(regex, replace);
    fs.writeFileSync(stringsFileLocation, result, 'utf8');
	console.log('change of plist file complete');

};