module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	uglify: {
	    options: {
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	    },
	    build: {
		files: {
		    'build/main.min.js': ['src/main.js', 'src/app.js']
		}
	    }
	},
	jshint: {
	    files: {
		src: ['src/**/*.js']
	    }
	}
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'uglify']);
};
