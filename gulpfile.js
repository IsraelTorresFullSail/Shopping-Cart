// Import the required dependencies
// (these are first installed with NPM)
const gulp = require('gulp')
// Browsersync is our local server, that will auto-reload the page and inject css
const browserSync = require('browser-sync')
// The gulp-sass plugin allows us to compile sass
const sass = require('gulp-sass')

// Following browsersync's documentation, create the server and set it to a constant.
const server = browserSync.create()

// Set up a helper reference to the various sources we may need throughout the file.
const src = {
  scss: 'scss/**/*.scss',
  css: 'css',
  html: '*.html',
}

// Define our CSS processing task
function css() {
  // When using gulp in a task, it is important to return the result
  return (
    gulp
      // Take in the scss source files via gulp.src()
      .src(src.scss)
      // Pipe our source file content through the sass function
      .pipe(sass().on('error', sass.logError))
      // Pipe the transformed file content into the gulp.dest() method to write the file out.
      .pipe(gulp.dest(src.css))
  )
}

// Define a reusable reload task for browsersync to use
// This task acts as a way to tell the server that changes have been made
function reload(done) {
  server.reload()
  done()
}

// Define our serve task to start up the browsersync server
function serve(done) {
  server.init({
    server: {
      baseDir: './',
    },
  })
  done()
}

// Define our watch task (this is using a shorthand arrow function syntax)
// gulp.watch() will then watch our source files, and on change run the tasks in gulp.series
const watch = () => gulp.watch([src.scss, src.html], gulp.series(css, reload))

// Finally, define a higher level task (dev), that runs a series of sub-tasks (css, serve, watch)
const dev = gulp.series(css, serve, watch)
// Export the dev task as the default to expose it to the gulp command line interface
exports.default = dev