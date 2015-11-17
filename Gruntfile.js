module.exports = function(grunt) {

	// Load tasks.
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({

        //---------------------------------------------
        // React JSX
        //---------------------------------------------
        react: {
            combined_file_output: {
                files: {
                    'scripts/JSX/TaskMaster.js': [
                        'scripts/JSX/**/*.jsx',
                        'scripts/JSX/TaskMaster.jsx'
                    ]
                }
            }
        },

        //---------------------------------------------
        // Minimize JS
        //---------------------------------------------
        uglify: {
            options: {
                compress: true
            },
            target: {
                files: {
                    'scripts/taskmaster.min.js': [
                        'scripts/vendor/*.js',
                        'scripts/JSX/*.js',
                        'scripts/app.js'
                    ]
                }                
            }
        },

        //---------------------------------------------
        // Sass
        //---------------------------------------------
        sass: {
            dest: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'style.css': 'scss/style.scss'
                }
            }
        },

        //---------------------------------------------
        // Watch
        //---------------------------------------------
        watch: {

            // Sass files.
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },

            react: {
                files: ['scripts/JSX/**/*.jsx', 'scripts/JSX/TaskMaster.jsx'],
                tasks: ['react'],
                options: {
                    spawn: false
                }
            },

            uglify: {
                files: ['scripts/JSX/TaskMaster.js', 'scripts/app.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false
                }
            }
        }

	});

	// Tasks.
    grunt.registerTask('default', ['sass', 'react', 'uglify']);
    grunt.registerTask('build', ['sass', 'react', 'uglify']);

};