// Install dependencies on node with this line:
// npm install –-save-dev gulp babelify browserify gulp-connect vinyl-source-stream gulp-sass gulp-autoprefixer run-sequence del gulp-cache gulp-imagemin
var gulp = require("gulp"),
  babelify = require("babelify"),
  browserify = require("browserify"),
  connect = require("gulp-connect"),
  source = require("vinyl-source-stream"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  runSequence = require("run-sequence"),
  del = require("del"),
  cache = require("gulp-cache"),
  imagemin = require("gulp-imagemin");

// shortcuts for folder paths
var paths = {
  entry_js: ["./src/js/index.js"],
  scripts: ["./src/js/**/*.js"],
  libs: ["./src/js/libs/*.js"],
  sass: ["./src/scss/**/style.scss"],
  css: ["./src/css/**/*.css"],
  html: ["src/html/*.html"],
  data: ["./src/data/*.*"],
  fonts: ["./src/fonts/*.*"],
  images: "src/images/**/*.+(png|jpg|gif|svg)",
  build: "./build"
};

// Default task
// Run 'gulp' command with no arguments
//gulp.task("default", ['build', 'startServer', 'watch']);

gulp.task("default", function(callback) {
  runSequence(
    "clean:build",
    "cache:clear",
    "build",
    ["startServer", "watch"],
    callback
  );
});

// Start a local server listening to 8080 port
// Home page: http://localhost:8080
gulp.task("startServer", function() {
  connect.server({
    root: "./build",
    livereload: true,
    port: 8080
  });
});

// Copy static files from html folder to build folder
gulp.task("copyHtml", function() {
  return gulp
    .src("./src/html/*.*")
    .pipe(gulp.dest("./build"))
    .pipe(connect.reload());
});

//Copy static files from html folder to build folder
gulp.task("copyLibs", function() {
  return gulp
    .src("./src/js/libs/*.*")
    .pipe(gulp.dest("./build/libs"))
    .pipe(connect.reload());
});

// Convert ES6 code in all js files in src/js folder
// Copy converted code to build folder as 'bundle.js'
gulp.task("js", function() {
  return browserify({
    entries: paths.entry_js
  })
    .transform(
      babelify.configure({
        presets: ["env"]
      })
    )
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(paths.build))
    .pipe(connect.reload());
});

// Converts sass to css
// With browser autoprefixer
gulp.task("sass", function() {
  return gulp
    .src(paths.sass)
    .pipe(autoprefixer({ browsers: ["last 2 versions"] }))
    .pipe(sass())
    .pipe(gulp.dest("src/css")); /*
  	.pipe(connect.reload());*/
});

// Run sass task and copy css files to build folder
gulp.task("copyCss", ["sass"], function() {
  return gulp
    .src(paths.css)
    .pipe(gulp.dest(paths.build + "/css"))
    .pipe(connect.reload());
});
// Copy and minify images, with cache
// Use 'gulp cache:clear' command to update images
gulp.task("copyImgs", function() {
  return gulp
    .src(paths.images)
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(paths.build + "/images"));
});
// Copy data files to build folder
gulp.task("copyData", function() {
  return gulp
    .src(paths.data)
    .pipe(gulp.dest(paths.build + "/data"))
    .pipe(connect.reload());
});
// Copy font files to build folder
gulp.task("copyFonts", function() {
  return gulp
    .src(paths.fonts)
    .pipe(gulp.dest(paths.build + "/fonts"))
    .pipe(connect.reload());
});

// Clean old files
gulp.task("clean:build", function() {
  return del.sync("build");
});

// Clear cache
gulp.task("cache:clear", function(callback) {
  return cache.clearAll(callback);
});

// Watch for changes to these folders
// Run task if files change
gulp.task("watch", function() {
  gulp.watch("./src/scss/**/*.scss", ["copyCss"]);
  gulp.watch("./src/html/*.*", ["copyHtml"]);
  gulp.watch("./src/js/libs/*.*", ["copyLibs"]);
  gulp.watch("./src/js/**/*.*", ["js"]);
  gulp.watch("./src/js/modules/*.*", ["js"]);
  gulp.watch("./src/data/*.*", ["copyData"]);
  gulp.watch("./src/fonts/*.*", ["copyFonts"]);
  gulp.watch("./src/images/*.*", ["copyImgs"]);
});

// Build task
// Runs copy and convert tasks in sequence
gulp.task("build", function(callback) {
  runSequence(
    "clean:build",
    "js",
    ["copyImgs", "copyHtml", "copyLibs", "copyCss", "copyData", "copyFonts"],
    callback
  );
});
