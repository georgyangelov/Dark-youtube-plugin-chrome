var gulp     = require('gulp'),
    sass     = require('gulp-sass'),
    concat   = require('gulp-concat'),
    postcss  = require('gulp-postcss'),
    sassLint = require('gulp-sass-lint'),

    del = require('del'),

    PATHS = {
        styles: 'src/styles/**/*.scss',
        static: 'static/',
        build: 'build/'
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

gulp.task('styles', function() {
    return gulp
        .src(PATHS.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css', {newLine: "\n"}))
        .pipe(postcss([ require('./add_important.js')() ]))
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('styles:watch', function() {
    gulp.watch(PATHS.styles, ['build']);
});

gulp.task('extension:prepare', function() {
    return gulp
        .src(PATHS.static + '**/*', {base: PATHS.static})
        .pipe(gulp.dest(PATHS.build));
});

gulp.task('build', ['clean', 'lint', 'styles', 'extension:prepare']);
gulp.task('watch', ['build', 'styles:watch']);

gulp.task('default', ['watch']);
