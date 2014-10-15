var gulp = require('gulp');

// plugins
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var contConcat = require('gulp-continuous-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var util = require('gulp-util');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var template = require('gulp-template');
var del = require('del');
var browserSync = require('browser-sync');
var karma = require('karma').server;

var ins = {
    js: ['src/**/*.js'],
    stylus: 'src/stylus/main.styl',
    html: 'src/index.html',
    karma: 'karma.conf.js'
};

var outs = {
    devDir: 'build',
    productionDir: 'bin'
};

gulp.task('clean:dev', function(cb) {
    del([
        outs.devDir
    ], cb);
});

gulp.task('clean:production', function() {
    del([
        outs.productionDir
    ], cb);
});

gulp.task('browser-sync', ['build:dev'], function() {
    browserSync(['./build/solar.js', './build/index.html'], {
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('test:once', function(done) {
    karma.start({
        configFile: __dirname + '/' + ins.karma,
        singleRun: true
    }, done);
});

gulp.task('test:cont', function(done) {
    karma.start({
        configFile: __dirname + '/' + ins.karma
    }, done);
});

///////////////////
//  Watch tasks  //
///////////////////

gulp.task('index:watch', function() {
    watch(ins.html)
        .pipe(gulp.dest(outs.devDir));
});

gulp.task('js:watch', function() {
    watch(ins.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(contConcat('solar.js'))
        .pipe(gulp.dest(outs.devDir));
});

gulp.task('stylus:watch', ['browser-sync'], function() {
    watch(ins.stylus)
        .pipe(stylus())
        .pipe(rename('solar.css'))
        .pipe(gulp.dest(outs.devDir))
        .pipe(browserSync.reload({stream:true}));
});

///////////////////
//  Build tasks  //
///////////////////

gulp.task('build:dev', ['clean:dev'], function() {
    gulp.src(ins.html)
        .pipe(gulp.dest(outs.devDir));
    gulp.src(ins.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('solar.js'))
        .pipe(gulp.dest(outs.devDir));
    gulp.src(ins.stylus)
        .pipe(stylus())
        .pipe(rename('solar.css'))
        .pipe(gulp.dest(outs.devDir))
});

gulp.task('build:production', ['clean:production'], function() {
    gulp.src(ins.html)
        .pipe(gulp.dest(outs.productionDir));
    gulp.src(ins.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(outs.productionDir));
    gulp.src(ins.stylus)
        .pipe(stylus())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(outs.productionDir))
});

gulp.task('default', ['build:dev', 'index:watch', 'js:watch', 'stylus:watch', 'browser-sync', 'test:cont']);

// TODO: add a task for building for production
