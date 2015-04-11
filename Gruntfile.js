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
            files: ['Gruntfile.js', 'src/**/*', 'test/**/*.js'],
            tasks: ['jshint', 'uglify', 'copy', 'replace']
        },
        clean: ['build'],
        copy: {
            html: {
                nonull: true,
                expand: true,
                cwd: 'src/html',
                src: ['**/*.html'],
                dest: 'build/html'
            },
            img: {
                nonull: true,
                expand: true,
                cwd: 'src',
                src: ['img/**/*.png'],
                dest: 'build/'
            }
        },
        replace: {
            resources: {
                src: ['src/manifest.json'],
                dest: 'build/',
                replacements: [
                    {
                        from: 'main.js',
                        to: 'main.min.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', ['jshint', 'uglify', 'copy', 'replace']);
};
