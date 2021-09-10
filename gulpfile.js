// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const rev = require("gulp-rev");
const clean = require("gulp-clean");

//  function clean_up() {
//    return src("dist").pipe(clean());
// }

// Sass Task
function scssTask1() {
   return (
      src("public/scss/error.scss", { sourcemaps: true }) // selecting the style/main scss file || { sourcemaps: true } will generate a .css.map file (show which scss file  the styles are coming from)
         .pipe(sass()) // running sass function to compile scss to css
         .pipe(postcss([autoprefixer(), cssnano()])) // using autoprefixer function will add the browser prefixes to support older browsers || and cssnano function to minify css file
         // // .pipe(rev())
         .pipe(dest("dist/CSS", { sourcemaps: "." }))
   ); // seting the destination of the compiled css and the map file to a folder called dist
}

function scssTask2() {
   return (
      src("public/scss/chat.scss", { sourcemaps: true }) // selecting the style/main scss file || { sourcemaps: true } will generate a .css.map file (show which scss file  the styles are coming from)
         .pipe(sass()) // running sass function to compile scss to css
         .pipe(postcss([autoprefixer(), cssnano()])) // using autoprefixer function will add the browser prefixes to support older browsers || and cssnano function to minify css file
         // // .pipe(rev())
         .pipe(dest("dist/CSS", { sourcemaps: "." }))
   ); // seting the destination of the compiled css and the map file to a folder called dist
}

function scssTask3() {
   return (
      src("public/scss/home.scss", { sourcemaps: true }) // selecting the style/main scss file || { sourcemaps: true } will generate a .css.map file (show which scss file  the styles are coming from)
         .pipe(sass()) // running sass function to compile scss to css
         .pipe(postcss([autoprefixer(), cssnano()])) // using autoprefixer function will add the browser prefixes to support older browsers || and cssnano function to minify css file
         // .pipe(rev())
         .pipe(dest("dist/CSS", { sourcemaps: "." }))
   ); // seting the destination of the compiled css and the map file to a folder called dist
}

function scssTask4() {
   return (
      src("public/scss/profile.scss", { sourcemaps: true }) // selecting the style/main scss file || { sourcemaps: true } will generate a .css.map file (show which scss file  the styles are coming from)
         .pipe(sass()) // running sass function to compile scss to css
         .pipe(postcss([autoprefixer(), cssnano()])) // using autoprefixer function will add the browser prefixes to support older browsers || and cssnano function to minify css file
         // .pipe(rev())
         .pipe(dest("dist/CSS", { sourcemaps: "." }))
   ); // seting the destination of the compiled css and the map file to a folder called dist
}

// function scssTask5() {
//    return (
//       src("public/scss/sign.scss", { sourcemaps: true }) // selecting the style/main scss file || { sourcemaps: true } will generate a .css.map file (show which scss file  the styles are coming from)
//          .pipe(sass()) // running sass function to compile scss to css
//          .pipe(postcss([autoprefixer(), cssnano()])) // using autoprefixer function will add the browser prefixes to support older browsers || and cssnano function to minify css file
//          // .pipe(rev())
//          .pipe(dest("dist/CSS", { sourcemaps: "." }))
//    ); // seting the destination of the compiled css and the map file to a folder called dist
// }

// JavaScript Task
function jsTask1() {
   return (
      src("public/js/sign.js", { sourcemaps: true }) // selecting the js file || { sourcemaps: true } will generate a .js.map file (show which js file  the scripts are coming from)
         .pipe(babel({ presets: ["@babel/preset-env"] })) // running babel function to compile JavaScript to older versions so old browsers can run it with no problems
         .pipe(terser()) // using terser function to minify JavaScript file
         // .pipe(rev())
         .pipe(dest("dist/js", { sourcemaps: "." }))
   ); // seting the destination of the compiled JavaScript and the map file to a folder called dist
}

function jsTask2() {
   return (
      src("public/js/profile.js", { sourcemaps: true }) // selecting the js file || { sourcemaps: true } will generate a .js.map file (show which js file  the scripts are coming from)
         .pipe(babel({ presets: ["@babel/preset-env"] })) // running babel function to compile JavaScript to older versions so old browsers can run it with no problems
         .pipe(terser()) // using terser function to minify JavaScript file
         // .pipe(rev())
         .pipe(dest("dist/js", { sourcemaps: "." }))
   ); // seting the destination of the compiled JavaScript and the map file to a folder called dist
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
   watch("views/*.ejs", browserSyncReload);
   watch(
      ["public/scss/*.scss", "public/js/*.js"],
      series(
         // clean_up,
         scssTask1,
         scssTask2,
         scssTask3,
         scssTask4,
         jsTask1,
         jsTask2,
         browserSyncReload
      )
   );
}

// Default Gulp Task
exports.default = series(
   // clean_up,
   scssTask1,
   scssTask2,
   scssTask3,
   scssTask4,
   jsTask1,
   jsTask2,
   watchTask
);
