var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var Server = require('karma').Server;
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var ngAnnotate = require('gulp-ng-annotate');

// ****************************************

gulp.task('buildApp', function(){
  return gulp.src('src/app.js')
    .pipe(concat('app.js'))
    //.pipe(ngAnnotate())
    .pipe(uglify({mangle:false}))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('buildVendor', function(){
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-xeditable/dist/js/xeditable.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'])
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('buildCSS', function(){
  return gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/angular-xeditable/dist/css/xeditable.css',
    'src/style.css'])
  .pipe(concat('styles.css'))
  .pipe(minifycss())
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload());
});

gulp.task('copyFonts', function() {
  return gulp.src(['bower_components/bootstrap/dist/fonts/*.*'])
    .pipe(gulp.dest('dist/fonts'));
})

gulp.task('moveHTML', function(){
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('build', ['buildVendor','buildApp', 'buildCSS', 'copyFonts', 'moveHTML']);

// **********************************

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('jshint', function(){
  return gulp.src(['src/**/*.js', 'tests/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['karma', 'jshint']);

// ***************************************

gulp.task('connect', function(){
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('watch', function(){
  gulp.watch('src/**/*.js', ['buildApp']);
  gulp.watch('src/**/*.css', ['buildCSS']);
  gulp.watch('src/**/*.html', ['moveHTML']);
});

// *******************************************

gulp.task('default', ['build', 'test', 'watch', 'connect']);
