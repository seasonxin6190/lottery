module.exports = function(grunt) {
  var style = require('grunt-cmd-transport').style.init(grunt);
  var template = require('grunt-cmd-transport').template.init(grunt);
  var pkg = grunt.file.readJSON('package.json');
  
  var jsconcats = {};
  var jsmins = [], cssmins = [];
  var copies = [];
  var jssrc = [], csssrc = [], tplsrc = [];

  var cleans = pkg.spm.cleanDist ? ['.build','dist'] : ['.build'];
  var copyCfg = pkg.spm.cleanDist ? ".min.js" : ".js";

  pkg.spm.output = pkg.spm.output || pkg.name;

  pkg.spm.src.forEach(function(name){
    jssrc.push(name+'/**/*.js');
    csssrc.push(name+'/**/*.css');
    tplsrc.push(name+'/**/*.tpl');
  });
  pkg.spm.idleading = pkg.spm.idleading || '';
  
  //为了按顺序合并,手动排列目录
  var jsconcatssrc = [];
  jssrc.forEach(function(name){
    jsconcatssrc.push('.build/src/'+name);
  });
  pkg.spm.idleading = pkg.spm.idleading || '';
  jsconcats['.build/dist/' + pkg.spm.output+'.js'] = jsconcatssrc;
  // jsconcats['.build/dist/' + pkg.spm.output+'.js'] = [ '.build/src/**/*.js' ];

  //压缩时将seajs一起压缩
  var uglifysrc = [];
  pkg.spm.withs.forEach(function(name){
    uglifysrc.push('src/'+name+'/**/*.js');
  });
  uglifysrc.push('.build/dist/'+pkg.spm.output+'.js');
  
  grunt.initConfig({
    pkg: pkg,
    transport: {
        js: {
            options: {
                alias: pkg.spm.alias,
                idleading: pkg.spm.idleading,
                debug: false,
            },
            files: [{
                cwd: pkg.spm.source,
                src: jssrc,
                filter: 'isFile',
                dest: '.build/src'
            }]
        },
        css: {
            options: {
              alias: pkg.spm.alias,
              idleading: pkg.spm.idleading,
              debug: false,
              parsers: {
                '.css': [style.css2jsParser]
              }
            },
            files: [{
              cwd: pkg.spm.source,
              src: csssrc,
              filter: 'isFile',
              dest: '.build/src'
            }]
        },
        tpl: {
            options: {
              alias: pkg.spm.alias,
              idleading: pkg.spm.idleading,
              debug: false,
              parsers: {
                '.tpl': [template.tplParser]
              }
            },
            files: [{
              cwd: pkg.spm.source,
              src: tplsrc,
              filter: 'isFile',
              dest: '.build/src'
            }]
        }
    },
    concat: {
      options: {
        include: 'relative'
      },
      js: {files: jsconcats},
    },
    cssmin: {
      options: {keepSpecialComments: 0},
      css: {files: cssmins}
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> By:<%= pkg.author%> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> Ver:<%=pkg.version%> description:<%=pkg.description%>*/\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.spm.output %>.min.js': uglifysrc
        }
      }
    },
    copy: {
      dist: {
        files: {
          'dist/<%= pkg.spm.output %>.js': ['.build/dist/<%= pkg.spm.output %>.js'],
          '<%= pkg.spm.target %>/<%= pkg.spm.output %>.js': ['dist/<%= pkg.spm.output %>'+copyCfg]
        }
      }
    },
    clean: {
      build: cleans
    }
  });

  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['transport', 'concat', 'cssmin', 'uglify', 'copy', 'clean']);

  grunt.registerTask('build', ['transport', 'concat', 'cssmin', 'uglify', 'copy', 'clean']);

  grunt.registerTask('test', ['transport','concat']);

};