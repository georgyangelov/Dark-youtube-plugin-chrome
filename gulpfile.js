var gulp     = require('gulp'),
    sass     = require('gulp-sass'),
    concat   = require('gulp-concat'),
    postcss  = require('gulp-postcss'),
    sassLint = require('gulp-sass-lint'),

    del = require('del'),

    PATHS = {
        styles: './src/styles/**/*.scss'
    };

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('lint', function() {
    return gulp
        .src(PATHS.styles)
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

gulp.task('styles', function() {
    return gulp
        .src(PATHS.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css', {newLine: "\n"}))
        .pipe(postcss([ require('./add_important.js')() ]))
        .pipe(gulp.dest('./build/'));
});

gulp.task('styles:watch', function() {
    gulp.watch(PATHS.styles, ['lint', 'styles']);
});

gulp.task('watch', ['clean', 'styles:watch', 'lint', 'styles']);
gulp.task('build', ['clean', 'lint', 'styles']);

gulp.task('default', ['watch']);
