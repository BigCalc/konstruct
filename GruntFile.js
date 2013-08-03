// © 2013 QUILLU INC.
// konstruct GruntFile
'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // JSON
    jsonlint: {
      src: [ 'package.json', '.jshintrc']
    },

    // JS
    jshint:{
      options:{
        jshintrc: '.jshintrc'
      },
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },

    // Test
    mochaTest: {
      test: {
        options: {
          reporter: 'dot'
        },
        src: ['test/**/*.js']
      }
    }

  });

  // Tasks
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('lint', ['jsonlint', 'jshint']);
  // Default
  grunt.registerTask('default', ['test']);

};
