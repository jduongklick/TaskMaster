module.exports = function(grunt) {

	// Load tasks.
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({

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

        watch: {

            // Sass files.
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }

        }

	});

	// Tasks.
	grunt.registerTask('default', ['sass', 'watch']);

};