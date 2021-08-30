// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// Use dart-sass for @use
// sass.compiler = require("dart-sass");

// Sass Task
function scssTask() {
   return src("public/scss/style.scss", { sourcemaps: true }) // selecting the style/main scss file || { sourcemaps: true } will generate a .css.map file (show which scss file  the styles are coming from)
      .pipe(sass()) // running sass function to compile scss to css
      .pipe(postcss([autoprefixer(), cssnano()])) // using autoprefixer function will add the browser prefixes to support older browsers || and cssnano function to minify css file
      .pipe(dest("dist", { sourcemaps: "." })); // seting the destination of the compiled css and the map file to a folder called dist
}

// JavaScript Task
function jsTask() {
   return src("public/js/script.js", { sourcemaps: true }) // selecting the js file || { sourcemaps: true } will generate a .js.map file (show which js file  the scripts are coming from)
      .pipe(babel({ presets: ["@babel/preset-env"] })) // running babel function to compile JavaScript to older versions so old browsers can run it with no problems
      .pipe(terser()) // using terser function to minify JavaScript file
      .pipe(dest("dist", { sourcemaps: "." })); // seting the destination of the compiled JavaScript and the map file to a folder called dist
}

// Browsersync
// function browserSyncServe(cb) {
//    browsersync.init({
//       server: {
//          baseDir: ".",
//       },
//       notify: {
//          styles: {
//             top: "auto",
//             bottom: "0",
//          },
//       },
//    });
//    cb();
// }
function browserSyncReload(cb) {
   browsersync.reload();
   cb();
}

// Watch Task
function watchTask() {
   watch("*.html", browserSyncReload);
   watch(
      ["app/scss/**/*.scss", "app/**/*.js"],
      series(scssTask, jsTask, browserSyncReload)
   );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, watchTask);
