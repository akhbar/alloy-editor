'use strict';

var gulp = require('gulp');

var argv = require('yargs').argv;
var concat = require('gulp-concat');
var del = require('del');
var fs = require('fs');
var path = require('path');
var react = require('gulp-react');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

var rootDir = path.join(__dirname, '..', '..', '..', '..');
var reactDir = path.join(rootDir, 'src', 'ui', 'react');
var pkg = require(path.join(rootDir, 'package.json'));

var distFolder = path.join(rootDir, 'dist');
var editorDistFolder = path.join(distFolder, 'alloy-editor-' + pkg.version, 'alloy-editor');

var srcFiles = require('../_src.js');

function errorHandler(error) {
  console.log(error.toString());

  this.emit('end');
}

gulp.task('build', function(callback) {
    runSequence(
        'clean-dist',
        [
            'build-css',
            'build-js'
        ],
        [
            'create-alloy-editor-all',
            'create-alloy-editor-no-ckeditor',
            'create-alloy-editor-no-react'
        ],
        'build-demo',
        callback
    );
});

gulp.task('release', function(callback) {
    runSequence(
        'clean-dist',
        [
            'build-css',
            'build-js'
        ],
        [
            'minimize-css',
            'minimize-alloy-editor-core'
        ],
        [
            'create-alloy-editor-all',
            'create-alloy-editor-all-min',
            'create-alloy-editor-no-ckeditor',
            'create-alloy-editor-no-ckeditor-min',
            'create-alloy-editor-no-react',
            'create-alloy-editor-no-react-min'
        ],
        'build-demo',
        'create-zip',
        callback
    );
});

gulp.task('build-demo', function() {
    var templateHead;

    if (argv._.indexOf('release') >= 0) {
        templateHead = 'head-release.template';
    }
    else {
        templateHead = 'head-dev.template';
    }

    return gulp.src([
            path.join(reactDir, 'demo', 'index.html'),
            path.join(reactDir, 'demo', 'bootstrap.css')
        ])
        .pipe(template({
            resources: fs.readFileSync(path.join(reactDir, 'template', templateHead))
        }))
        .pipe(gulp.dest(path.join(distFolder, 'alloy-editor-' + pkg.version)));
});

gulp.task('build-js', function(callback) {
    runSequence([
        'copy-ckeditor',
        'create-alloy-editor-core'
    ], 'wrap-alloy-editor', callback);
});

gulp.task('clean-dist', function(callback) {
    return del(distFolder, callback);
});

gulp.task('copy-ckeditor', function() {
    return gulp.src(path.join(rootDir, 'lib', 'ckeditor', '/**'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-all', function() {
    return gulp.src([
            path.join(editorDistFolder, 'ckeditor.js'),
            path.join(reactDir, 'vendor', 'react.js'),
            path.join(editorDistFolder, 'alloy-editor-core.js')
        ])
        .pipe(concat('alloy-editor-all.js'))
        .pipe(replace(/ckeditor(\\?).js/g, 'alloy-editor-all$1.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-no-ckeditor', function() {
    return gulp.src([
            path.join(reactDir, 'vendor', 'react.js'),
            path.join(editorDistFolder, 'alloy-editor-core.js')
        ])
        .pipe(concat('alloy-editor-no-ckeditor.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-no-react', function() {
    return gulp.src([
            path.join(editorDistFolder, 'ckeditor.js'),
            path.join(editorDistFolder, 'alloy-editor-core.js')
        ])
        .pipe(concat('alloy-editor-no-react.js'))
        .pipe(replace(/ckeditor(\\?).js/g, 'alloy-editor-no-react$1.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-all-min', function() {
    return gulp.src([
            path.join(editorDistFolder, 'ckeditor.js'),
            path.join(reactDir, 'vendor', 'react-min.js'),
            path.join(editorDistFolder, 'alloy-editor-core-min.js')
        ])
        .pipe(concat('alloy-editor-all-min.js'))
        .pipe(replace(/ckeditor(\\?).js/g, 'alloy-editor-all-min$1.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-no-ckeditor-min', function() {
    return gulp.src([
            path.join(reactDir, 'vendor', 'react-min.js'),
            path.join(editorDistFolder, 'alloy-editor-core-min.js')
        ])
        .pipe(concat('alloy-editor-no-ckeditor-min.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-no-react-min', function() {
    return gulp.src([
            path.join(editorDistFolder, 'ckeditor.js'),
            path.join(editorDistFolder, 'alloy-editor-core-min.js')
        ])
        .pipe(concat('alloy-editor-no-react-min.js'))
        .pipe(replace(/ckeditor(\\?).js/g, 'alloy-editor-no-react-min$1.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-alloy-editor-core', function() {
    return gulp.src(srcFiles, {cwd : rootDir + '/src'})
    .pipe(react()).on('error', errorHandler)
    .pipe(concat('alloy-editor-core.js'))
    .pipe(gulp.dest(editorDistFolder));
});

gulp.task('create-zip', function() {
    return gulp.src(path.join(distFolder, '/**'))
        .pipe(zip('alloy-editor-' + pkg.version + '.zip'))
        .pipe(gulp.dest(distFolder));
});

gulp.task('minimize-alloy-editor-core', function() {
    return gulp.src([
            path.join(editorDistFolder, 'alloy-editor-core.js')
        ])
        .pipe(uglify())
        .pipe(rename('alloy-editor-core-min.js'))
        .pipe(gulp.dest(editorDistFolder));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/**/*', ['build']);
});
