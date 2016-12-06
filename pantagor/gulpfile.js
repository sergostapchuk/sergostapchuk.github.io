var gulp         = require('gulp'),
   postcss      = require('gulp-postcss'),
   sass         = require('gulp-sass'),
   autoprefixer = require('autoprefixer'),
   browser      = require('browser-sync'),
   sourcemaps   = require('gulp-sourcemaps'),
   iconfont     = require("gulp-iconfont"),
   consolidate  = require("gulp-consolidate"),
// source and distribution folder
	source      = 'src/',
	dest 		= 'dist/',
	//Bootstrap scss source
	bootstrapSass = {
		in: './node_modules/bootstrap-sass/'
	};
	
	
gulp.task('sass', function () {
     return gulp.src('src/sass/**/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest('dist/css'))
   	   .pipe(browser.stream({match: '**/*.css'}));
});

// Starts a BrowerSync instance
gulp.task('serve', ['sass'], function(){
 browser.init({
       server: {
           baseDir: "./"
       }
   });
});  
gulp.task('default',['serve'], function() {    
 gulp.watch(['src/sass/**/*.scss'], ['sass']); 
 gulp.watch('./**/*.html').on('change', browser.reload); 
});
gulp.task("build:icons", function() {
   return gulp.src(["./icons/*.svg"]) //path to svg icons
     .pipe(iconfont({
       fontName: "myicons",
       formats: ["ttf", "eot", "woff", "svg"],
       centerHorizontally: true,
       fixedWidth: true,
       normalize: true

     }))
     .on("glyphs", (glyphs) => {

       gulp.src("./icons/util/*.scss") // Template for scss files
           .pipe(consolidate("lodash", {
               glyphs: glyphs,
               fontName: "myicons",
               fontPath: "../../../fonts/"
           }))
           .pipe(gulp.dest("./sass/icons/")); // generated scss files with classes
     })
     .pipe(gulp.dest("./fonts/")); // icon font destination
});
 
