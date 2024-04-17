const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
var babel = require('gulp-babel');

const jsroot = './src/js/';

// Vendor js and plugins
const vendorModules = {
  consoleErrorsFix: jsroot + 'vendor/console.errors.fix.js',
  slickSlider: jsroot + 'vendor/slick.unmin.js'
};

// Load js files in the right way.
const mainJsFiles = [
  vendorModules.consoleErrorsFix,
  vendorModules.slickSlider,
  jsroot + 'main.js'
];

// SASS Task
gulp.task('sass', () => {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) //compile sass to compact css
    .pipe(autoprefixer('last 2 version', 'ie 9')) //prefix css
    .pipe(rename('styles.unmin.css')) //set name of unmin file
    .pipe(gulp.dest('./dist/css/unmin/')) //save unmin css file
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) //copile sass to compressed css
    .pipe(cleanCSS({ compatibility: 'ie9' })) //clean css file
    .pipe(rename('styles.min.css')) //set name of min file
    .pipe(gulp.dest('./dist/css/min/')); //save min css file
});

// JS Task
gulp.task('js', () => {
  return gulp
    .src(mainJsFiles)
    .pipe(babel({ presets: ['@babel/env'] })) //babel transpiler to ES5
    .pipe(concat('main.js')) //concatanation
    .pipe(gulp.dest('./dist/js/unmin/')) //save unmin file
    .pipe(rename('main.min.js')) //rename file
    .pipe(uglify()) //uglify
    .pipe(gulp.dest('./dist/js/min/')); //save min file
});

// Builder Task
gulp.task('build', gulp.series('sass', 'js'));

// Watcher Task
gulp.task('watch', () => {
  gulp.watch(['./src/scss/**/*.scss'], gulp.series('sass'));
  gulp.watch(['./src/js/**/*.js'], gulp.series('js'));
});
