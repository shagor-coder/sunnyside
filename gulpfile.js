const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const terser = require('gulp-terser')
const prefixer = require('autoprefixer')
const browsersync = require('browser-sync').create()

// Sass Task
function scssTask() {
  return src('src/scss/style.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(
      postcss([
        prefixer(
          '> 1%',
          'ie >= 7',
          'edge >= 10',
          'ie_mob >= 7',
          'ff >= 42',
          'chrome >= 38',
          'safari >= 5',
          'opera >= 23',
          'ios >= 7',
          'android >= 4',
          'bb >= 10'
        ),
      ])
    )
    .pipe(dest('public/css', { sourcemaps: '.' }))
}

// JavaScript Task
function jsTask() {
  return src('src/js/script.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('public/js', { sourcemaps: '.' }))
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
  })
  cb()
}

function browsersyncReload(cb) {
  browsersync.reload()
  cb()
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload)
  watch(
    ['src/scss/**/*.scss', 'src/js/**/*.js'],
    series(scssTask, jsTask, browsersyncReload)
  )
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask)
