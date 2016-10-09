var gulp     = require('gulp'),
    zip      = require('gulp-zip'),
    sass     = require('gulp-sass'),
    babel    = require('gulp-babel'),
    concat   = require('gulp-concat'),
    postcss  = require('gulp-postcss'),
    sassLint = require('gulp-sass-lint'),

    del = require('del'),

    PATHS = {
        content_script: 'src/scripts/content.js',
        background_scripts: 'src/scripts/background/**/*',
        background_script: 'src/scripts/background.js',
        styles: 'src/styles/**/*.scss',
        static: 'static/',
        build: 'build/',
        zip: 'build/dark-youtube.zip'
    },

    BABEL_CONFIG = {
        presets: ['es2015']
    };

gulp.task('clean', function() {
    return del(PATHS.build + '/**/*');
});

gulp.task('lint', function() {
    return gulp
        .src(PATHS.styles)
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

gulp.task('styles', ['clean'], function() {
    return gulp
        .src(PATHS.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css', {newLine: "\n"}))
        .pipe(postcss([ require('./add_important.js')() ]))
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('scripts:content', ['clean'], function() {
    return gulp
        .src(PATHS.content_script)
        .pipe(babel(BABEL_CONFIG))
        .pipe(concat('content_script.js', {newLine: "\n"}))
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('scripts:background', ['clean'], function() {
    return gulp
        .src([PATHS.background_scripts, PATHS.background_script])
        .pipe(babel(BABEL_CONFIG))
        .pipe(concat('background_script.js', {newLine: "\n"}))
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('extension:prepare', ['clean'], function() {
    return gulp
        .src(PATHS.static + '**/*', {base: PATHS.static})
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('package:zip', ['build'], function() {
    var zipPaths = [
        PATHS.build + '**/*',
        '!' + PATHS.zip
    ];

    return gulp.src(zipPaths, {base: PATHS.build})
        .pipe(zip('dark-youtube.zip'))
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('scripts', ['scripts:background', 'scripts:content']);

gulp.task('build', ['clean', 'lint', 'styles', 'scripts', 'extension:prepare']);
gulp.task('watch', ['build'], function() {
    gulp.watch([
        PATHS.content_script,
        PATHS.background_scripts,
        PATHS.background_script,
        PATHS.styles
    ], ['build']);
});

gulp.task('package', ['build', 'package:zip']);

gulp.task('default', ['watch']);
