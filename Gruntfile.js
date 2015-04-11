module.exports = function (grunt) {

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
                src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
            }
        },
        watch: {
            //files: ['<%= jshint.files %>'],
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            tasks: ['jshint']
        },
        clean: ['build']
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['jshint', 'uglify']);
};
