"use_strict";

var gulp = require('gulp');
var rename = require('gulp-rename');
var through = require('through');
var fs = require('fs');
var concat = require('gulp-concat');
var wiredep = require('wiredep').stream;
var insert = require('gulp-insert');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var spritesmith = require('gulp.spritesmith');
var sprite_texturepacker = require('./gulp/spritejsonformat.js');
var filelist = require('gulp-filelist');

var reload = browserSync.reload;

var config = {
  entryFile: './src/js/Main.js',
  htmlTemplate: './index.tpl.html',
  spritesIn: './res/images/**/*.png',
  spritesOut: './build/res/',
  outputHtml: './build/index.html',
  outputDir: './build/js',
  outputFile: 'main.js'
};

var resPath = ['./res/**/*.*', '!**/sprites/**/*'];

var jsPaths = ['./src/','./src/js'];

gulp.task('res', ['sprite', 'res-copy', 'res-list']);

gulp.task('res-list', function(){
  gulp.src(resPath)
    .pipe(filelist('filelist.json'))
    .pipe(gulp.dest('./build/res/'));
});

gulp.task('res-copy', function(){
  gulp.src(resPath)
    .pipe(gulp.dest('./build/res/'));
});

gulp.task('sprite', function(){
  var spriteOptions = {
    imgName : 'sprite.png',
    cssName : 'sprite.json',
    cssTemplate : sprite_texturepacker,
    padding: 0
  };

  var spriteData = gulp.src( 'res/sprites/**/*.png' )
    .pipe(spritesmith(spriteOptions));
  spriteData.css
    .pipe(gulp.dest( 'build/res/sprite/' ));
  spriteData.img
    .pipe(gulp.dest( 'build/res/sprite/' ));
});

var genNote = {
    js: '// NOTE: This file has been generated automatically\n',
    html: '<!-- NOTE: This file has been generated automatically -->\n'
};

gulp.task('html', function() {
  gulp.src(config.htmlTemplate)
   .pipe(concat(config.outputHtml))
   .pipe(gulp.dest('./'))
   .pipe(wiredep())
   .pipe(insert.prepend(genNote.html))
   .pipe(gulp.dest('./'));
});

gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend(
        { debug: true, paths: jsPaths }, watchify.args
    )));
  }
  return bundler;
}

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', function() { //['clean']
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    server: {
      baseDir: './build/'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent');
  });
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('default', ['clean', 'html', 'build']);
