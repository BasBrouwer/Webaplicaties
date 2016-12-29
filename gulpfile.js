const gulp          = require('gulp');
const babelify      = require('babelify');
const browserify    = require('browserify');
const source        = require('vinyl-source-stream');
const buffer        = require('vinyl-buffer');
const uglify        = require('gulp-uglify');
const sourcemaps    = require('gulp-sourcemaps');
const sass          = require('gulp-sass');
const browserSync   = require('browser-sync').create();


gulp.task('run', function() {
    var bundler = browserify('./src/script.es6', {debug:true})
      .transform(babelify, {presets: ['es2015']})
      .bundle();

    return bundler
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.*', ['run']);
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch(['./public/assets/css/**/**.css', './public/assets/js/**/*.js', './public/*.html']).on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'run', 'sass', 'browser-sync']);