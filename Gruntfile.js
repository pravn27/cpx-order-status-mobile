'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


    watch: {
      files: [
        './www_dev/**/*',
		'./www/index.html',
        // Don't watch deps or generated files
        '!./www_dev/js/bundle.js',
        '!./www_dev/js/bundle.css',
        '!./www_dev/bower_components/**'
      ],
      tasks: ['prepare:debug', 'copy:debug'],
      options: {
        'event': ['all']
      }
    },

    shell: {
      'browserify-debug': {
        command: 'browserify ./www_dev/js/index.js -o ./www_build/js/bundle.js -d'
      },
      'browserify-release': {
        command: 'browserify ./www_dev/js/index.js -o ./www_build/js/bundle.js'
      },
      'cordova': {
        command: 'cordova build'
      },
	  'cordova-run': {
		  command: 'cordova run'
	  }
    },

    uglify: {
      // Create release JS from script tags and browserified JS bundle
      release: {
        // mangle: true,
        options: {
          beautify: false,
          compress: {},
          mangle: false
        },
        files: [
			{src: './www_build/js/bundle.js', dest: './www_build/js/index.min.js'}
		]
      }
    },

    copy: {
	  debug: {
		files: [
		  { src: './www_build/js/bundle.js', dest: './www/js/index.js'}
		  //{ src: './www_dev/index_debug.html', dest: './www/index.html'}
		],  
	  },
      release: {
        files: [
		  { src: 'www_build/js/index.min.js', dest: 'www/js/index.js'}
		  //{ src: 'www_dev/index.html', dest: 'www/index.html'}
        ],
      }
    },
	
	ripple: {
		options: {
			path: '.',
			keepAlive: false
		},
		run: {
			
		}
	},
  });

  grunt.loadNpmTasks('browserify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ripple-emulator');
  
  // Serve files and watch for changes
  grunt.registerTask('server', ['prepare:debug', 'copy:debug', 'ripple', 'watch']);

  // Build debug files for ./www
  grunt.registerTask('prepare:debug', [
    'shell:browserify-debug'
  ]);
  
  grunt.registerTask('prepare:device', [
	'prepare:debug',
	'copy:debug',
	'shell:cordova-run'
  ]);

  // Build release files and write to /www
  grunt.registerTask('prepare:release', [
    'prepare:debug', // Debug src needs to be configured first
    'shell:browserify-release',
	'uglify:release',
    'copy:release'
  ]);

  grunt.registerTask('build', [
    'prepare:release',
    'shell:cordova'
  ]);
  
  grunt.registerTask('emulate', ['ripple']);
};
